// Comunicarea cu API-ul Anthropic. Funcția e „pură”: primește datele de care
// are nevoie și întoarce JSON-ul răspunsului, fără să atingă interfața.
window.ChatApp = window.ChatApp || {};

(function (App) {
  App.callClaude = async function (opts) {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': opts.apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true'
      },
      body: JSON.stringify({
        model: opts.model,
        max_tokens: 1024,
        messages: opts.messages
      })
    });
    return res.json();
  };
})(window.ChatApp);
