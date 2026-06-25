// Punctul de intrare: starea aplicației + legarea evenimentelor.
// Se încarcă ultimul, după dom.js / render.js / storage.js / api.js.
window.ChatApp = window.ChatApp || {};

(function (App) {
  App.state = {
    apiKey: '',
    history: []
  };

  const els = App.els;

  // Salvarea cheii API (rămâne doar în memorie, pe durata sesiunii).
  els.saveBtn.addEventListener('click', function () {
    const v = els.keyInput.value.trim();
    if (!v) {
      App.setStatus('Introdu o cheie validă mai întâi.', false);
      return;
    }
    if (!v.startsWith('sk-ant-')) {
      App.setStatus('Atenție: cheile Anthropic începe de obicei cu "sk-ant-". Verifică ce ai lipit.', false);
    }
    App.state.apiKey = v;
    els.keyInput.value = '••••••••••••••••';
    els.keyInput.disabled = true;
    els.saveBtn.disabled = true;
    App.setStatus('Cheie salvată local, doar pentru această sesiune de browser.', true);
  });

  // Ștergerea conversației salvate.
  els.clearBtn.addEventListener('click', function () {
    App.clearHistory();
  });

  // Trimiterea unui mesaj și afișarea răspunsului.
  async function send() {
    const text = els.inputEl.value.trim();
    if (!text) return;
    if (!App.state.apiKey) {
      App.setStatus('Salvează mai întâi cheia API.', false);
      return;
    }

    App.addMessage('user', text);
    App.state.history.push({ role: 'user', content: text });
    App.saveHistory();
    els.inputEl.value = '';
    els.sendBtn.disabled = true;

    const pending = App.addMessage('assistant', 'Se generează răspunsul...');
    pending.classList.add('pending');

    try {
      const data = await App.callClaude({
        apiKey: App.state.apiKey,
        model: els.modelSelect.value,
        messages: App.state.history
      });

      if (data.error) {
        pending.classList.remove('pending');
        pending.classList.add('error');
        pending.textContent = 'Eroare API: ' + (data.error.message || JSON.stringify(data.error));
      } else {
        const block = (data.content || []).find(function (b) { return b.type === 'text'; });
        const reply = block ? block.text : '(fără răspuns text)';
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
