// Punctul de intrare: starea aplicației + legarea evenimentelor.
// Se încarcă ultimul, după dom.js / render.js / storage.js / api.js.
window.ChatApp = window.ChatApp || {};

(function (App) {
  App.state = {
    history: []
  };

  const els = App.els;

  // Ștergerea conversației salvate.
  els.clearBtn.addEventListener('click', function () {
    App.clearHistory();
  });

  // Trimiterea unui mesaj și afișarea răspunsului.
  async function send() {
    const text = els.inputEl.value.trim();
    if (!text) return;

    App.addMessage('user', text);
    App.state.history.push({ role: 'user', content: text });
    App.saveHistory();
    els.inputEl.value = '';
    els.sendBtn.disabled = true;

    const pending = App.addMessage('assistant', 'Se generează răspunsul...');
    pending.classList.add('pending');

    try {
      const data = await App.callClaude({
        model: els.modelSelect.value,
        messages: App.state.history
      });

      if (data.error) {
        pending.classList.remove('pending');
        pending.classList.add('error');
        pending.textContent = 'Eroare API: ' + (data.error.message || JSON.stringify(data.error));
      } else {
        const block = (data.content || []).find(function (b) { return b.type === 'text'; });
        let reply = block ? block.text : '(fără răspuns text)';
        if (data.stop_reason === 'max_tokens') {
          reply += '\n\n_[Răspuns întrerupt: s-a atins limita de tokeni (max_tokens). Cere „continuă" pentru rest.]_';
        }
        pending.classList.remove('pending');
        pending.dataset.raw = reply;
        App.renderContent(pending, reply);
        App.state.history.push({ role: 'assistant', content: reply });
        App.saveHistory();
      }
    } catch (err) {
      pending.classList.remove('pending');
      pending.classList.add('error');
      pending.textContent = 'Eroare de rețea: ' + err.message;
    }

    els.sendBtn.disabled = false;
    els.inputEl.focus();
  }

  els.sendBtn.addEventListener('click', send);
  els.inputEl.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  });

  App.loadHistory();
})(window.ChatApp);
