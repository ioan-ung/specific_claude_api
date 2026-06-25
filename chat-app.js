window.ChatApp = window.ChatApp || {};
(function (App) {
App.callClaude = async function (opts) {
const res = await fetch('/api/chat', {
method: 'POST',
headers: {
'Content-Type': 'application/json'
      },
body: JSON.stringify({
model: opts.model,
messages: opts.messages
      })
    });
return res.json();
  };
})(window.ChatApp);