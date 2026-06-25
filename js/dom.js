// Referințe către elementele din pagină + helper de stare.
// Toate fișierele JS comunică prin namespace-ul global `ChatApp`.
window.ChatApp = window.ChatApp || {};

(function (App) {
  App.els = {
    keyInput: document.getElementById('api-key'),
    saveBtn: document.getElementById('save-key-btn'),
    clearBtn: document.getElementById('clear-btn'),
    keyStatus: document.getElementById('key-status'),
    modelSelect: document.getElementById('model-select'),
    messagesEl: document.getElementById('messages'),
    inputEl: document.getElementById('user-input'),
    sendBtn: document.getElementById('send-btn'),
  };

  App.setStatus = function (text, ok) {
    App.els.keyStatus.textContent = text;
    App.els.keyStatus.style.color = ok ? '#5DCAA5' : '#888780';
  };
})(window.ChatApp);
