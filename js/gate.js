// Poartă de parolă: acoperă pagina până când userul introduce parola corectă.
// Parola se citește din fișierul password.txt (alături de index.html).
// Se încarcă primul, înaintea restului scripturilor.
(function () {
  var overlay = document.getElementById('gate');
  var input = document.getElementById('gate-password');
  var btn = document.getElementById('gate-btn');
  var msg = document.getElementById('gate-msg');

  // Citim parola așteptată din fișier (o singură dată).
  var expected = null;
  fetch('password.txt', { cache: 'no-store' })
    .then(function (r) {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.text();
    })
    .then(function (text) {
      expected = text.trim();
    })
    .catch(function (err) {
      msg.textContent = 'Nu am putut citi fișierul cu parola: ' + err.message;
      msg.style.color = '#F09595';
    });

  function check() {
    if (expected === null) {
      msg.textContent = 'Parola încă se încarcă, mai încearcă o dată.';
      msg.style.color = '#888780';
      return;
    }
    if (input.value === expected) {
      // Parolă corectă: ascundem poarta și deblocăm aplicația.
      overlay.remove();
      document.body.classList.remove('locked');
    } else {
      msg.textContent = 'Parolă greșită.';
      msg.style.color = '#F09595';
      input.value = '';
      input.focus();
    }
  }

  btn.addEventListener('click', check);
  input.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      check();
    }
  });

  // Arată/ascunde panoul la click pe "Contul meu"
  var loginBtn = document.getElementById('ns-login-btn');
  var closeBtn = document.getElementById('gate-pw-close');
  var pwPanel  = document.getElementById('gate-pw-panel');

  function showPanel() {
    pwPanel.style.display = 'flex';
    input.value = '';
    msg.textContent = '';
    input.focus();
  }
  function hidePanel() {
    pwPanel.style.display = 'none';
  }

  if (loginBtn) loginBtn.addEventListener('click', function (e) {
    e.preventDefault();
    pwPanel.style.display === 'flex' ? hidePanel() : showPanel();
  });
  if (closeBtn) closeBtn.addEventListener('click', hidePanel);
})();
