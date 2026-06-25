// Referințe către elementele din pagină + helper de stare.
// Toate fișierele JS comunică prin namespace-ul global `ChatApp`.
window.ChatApp = window.ChatApp || {};

(function (App) {
  App.els = {
    clearBtn: document.getElementById('clear-btn'),
    modelSelect: document.getElementById('model-select'),
    messagesEl: document.getElementById('messages'),
    inputEl: document.getElementById('user-input'),
    sendBtn: document.getElementById('send-btn'),
  };
})(window.ChatApp);
