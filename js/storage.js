// Persistența conversației în localStorage: salvare, încărcare la pornire
// și ștergere. Istoricul efectiv stă în `App.state.history` (vezi app.js).
window.ChatApp = window.ChatApp || {};

(function (App) {
  const STORAGE_KEY = 'claude-chat-history-v1';

  App.saveHistory = function () {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(App.state.history));
    } catch (e) {}
  };

  App.loadHistory = function () {
    let saved = [];
    try {
      saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    } catch (e) {
      saved = [];
    }
    if (!Array.isArray(saved) || saved.length === 0) return;

    App.state.history = saved;
    const ph = App.els.messagesEl.querySelector('.placeholder');
    if (ph) ph.remove();

    saved.forEach(function (entry) {
      if (entry.role === 'user') {
        App.addMessage('user', entry.content);
      } else {
        const bubble = App.addMessage('assistant', entry.content);
        bubble.dataset.raw = entry.content;
        App.renderContent(bubble, entry.content);
      }
    });
  };

  App.clearHistory = function () {
    App.state.history = [];
    try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
    App.els.messagesEl.innerHTML = '<p class="placeholder">Introdu cheia API mai sus, apoi scrie un mesaj.</p>';
  };
})(window.ChatApp);
