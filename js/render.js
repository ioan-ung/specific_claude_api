// Tot ce ține de afișare: iconițe, butoane de copiere, parsarea blocurilor
// de cod și construirea bulelor de mesaj în interfață.
window.ChatApp = window.ChatApp || {};

(function (App) {
  const COPY_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>';
  const CHECK_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';

  App.escapeHtml = function (str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  };

  App.makeCopyButton = function (getText, sizeClass) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = sizeClass;
    btn.title = 'Copiază';
    btn.innerHTML = COPY_ICON;
    btn.addEventListener('click', function () {
      const value = getText();
      const done = function () {
        btn.innerHTML = CHECK_ICON;
        btn.classList.add('copied');
        setTimeout(function () {
          btn.innerHTML = COPY_ICON;
          btn.classList.remove('copied');
        }, 1200);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(value).then(done).catch(function () {});
      } else {
        const ta = document.createElement('textarea');
        ta.value = value;
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand('copy'); done(); } catch (e) {}
        document.body.removeChild(ta);
      }
    });
    return btn;
  };

  // Parsează text simplu cu blocuri ```lang\ncod\n``` și construiește
  // un container cu paragrafe de text + blocuri de cod evidențiate, fiecare
  // bloc de cod cu propriul buton de copiere.
  App.renderContent = function (container, text) {
    container.innerHTML = '';
    const regex = /```([a-zA-Z0-9_+-]*)\n?([\s\S]*?)```/g;
    let lastIndex = 0;
    let match;
    let hasCode = false;

    function appendText(chunk) {
      if (!chunk) return;
      const p = document.createElement('div');
      p.className = 'text-part';
      p.textContent = chunk;
      container.appendChild(p);
    }

    while ((match = regex.exec(text)) !== null) {
      hasCode = true;
      appendText(text.slice(lastIndex, match.index));

      const lang = match[1] || 'cod';
      const code = match[2].replace(/\n$/, '');

      const block = document.createElement('div');
      block.className = 'code-block';

      const header = document.createElement('div');
      header.className = 'code-block-header';
      const label = document.createElement('span');
      label.textContent = lang;
      header.appendChild(label);
      const copyBtn = App.makeCopyButton(function () { return code; }, 'code-block-copy');
      header.appendChild(copyBtn);
      block.appendChild(header);

      const pre = document.createElement('pre');
      pre.textContent = code;
      block.appendChild(pre);

      container.appendChild(block);
      lastIndex = regex.lastIndex;
    }

    appendText(text.slice(lastIndex));

    if (!hasCode) {
      container.textContent = text;
    }

    return hasCode;
  };

  App.addMessage = function (role, text) {
    const messagesEl = App.els.messagesEl;
    const ph = messagesEl.querySelector('.placeholder');
    if (ph) ph.remove();
    const row = document.createElement('div');
    row.className = 'row ' + role;
    const msg = document.createElement('div');
    msg.className = 'msg';
    const bubble = document.createElement('div');
    bubble.className = 'bubble';
    bubble.textContent = text;
    const copyBtn = App.makeCopyButton(function () { return bubble.dataset.raw || bubble.textContent; }, 'copy-btn');
    msg.appendChild(bubble);
    msg.appendChild(copyBtn);
    row.appendChild(msg);
    messagesEl.appendChild(row);
    messagesEl.scrollTop = messagesEl.scrollHeight;
    return bubble;
  };
})(window.ChatApp);
