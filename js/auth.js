/* ================================================
   js/auth.js  — feature/auth
   User registration, login, logout, session via
   localStorage. Exposes window.AUTH API.
   ================================================ */

window.AUTH = (() => {
  const USERS_KEY = 'lumastore_users';
  const SESSION_KEY = 'lumastore_session';

  /* ---- Storage Helpers ---- */
  function getUsers() {
    try { return JSON.parse(localStorage.getItem(USERS_KEY)) || []; }
    catch { return []; }
  }
  function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }
  function getSession() {
    try { return JSON.parse(localStorage.getItem(SESSION_KEY)); }
    catch { return null; }
  }
  function saveSession(user) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  }
  function clearSession() {
    localStorage.removeItem(SESSION_KEY);
  }

  /* ---- Auth Operations ---- */
  function register(name, email, password) {
    const users = getUsers();
    if (users.find(u => u.email === email)) {
      return { ok: false, error: 'An account with this email already exists.' };
    }
    if (password.length < 6) {
      return { ok: false, error: 'Password must be at least 6 characters.' };
    }
    const user = { id: Date.now(), name, email, password, createdAt: new Date().toISOString() };
    users.push(user);
    saveUsers(users);
    const { password: _, ...safeUser } = user;
    saveSession(safeUser);
    return { ok: true, user: safeUser };
  }

  function login(email, password) {
    const users = getUsers();
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) return { ok: false, error: 'Incorrect email or password.' };
    const { password: _, ...safeUser } = user;
    saveSession(safeUser);
    return { ok: true, user: safeUser };
  }

  function logout() {
    clearSession();
    window.dispatchEvent(new CustomEvent('auth:change', { detail: null }));
    window.WISHLIST && window.WISHLIST.clear();
  }

  function current() { return getSession(); }
  function isLoggedIn() { return !!getSession(); }

  /* ---- UI Bindings ---- */
  function init() {
    const overlay      = document.getElementById('authOverlay');
    const modal        = document.getElementById('authModal');
    const loginForm    = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const tabLogin     = document.getElementById('tabLogin');
    const tabReg       = document.getElementById('tabRegister');
    const authNavBtn   = document.getElementById('authNavBtn');
    const closeAuth    = document.getElementById('closeAuth');
    const switchToReg  = document.getElementById('switchToRegister');
    const switchToLog  = document.getElementById('switchToLogin');

    function openAuth(tab = 'login') {
      modal.classList.add('active');
      overlay.classList.add('active');
      showTab(tab);
    }
    function closeModal() {
      modal.classList.remove('active');
      overlay.classList.remove('active');
    }
    function showTab(tab) {
      if (tab === 'login') {
        loginForm.classList.remove('hidden');
        registerForm.classList.add('hidden');
        tabLogin.classList.add('active');
        tabReg.classList.remove('active');
      } else {
        registerForm.classList.remove('hidden');
        loginForm.classList.add('hidden');
        tabReg.classList.add('active');
        tabLogin.classList.remove('active');
      }
    }

    authNavBtn.addEventListener('click', () => {
      if (isLoggedIn()) {
        toggleUserMenu();
      } else {
        openAuth('login');
      }
    });

    closeAuth.addEventListener('click', closeModal);
    overlay.addEventListener('click', closeModal);
    tabLogin.addEventListener('click', () => showTab('login'));
    tabReg.addEventListener('click', () => showTab('register'));
    switchToReg && switchToReg.addEventListener('click', e => { e.preventDefault(); showTab('register'); });
    switchToLog && switchToLog.addEventListener('click', e => { e.preventDefault(); showTab('login'); });

    document.getElementById('footerLoginLink')    && document.getElementById('footerLoginLink').addEventListener('click', e => { e.preventDefault(); openAuth('login'); });
    document.getElementById('footerRegisterLink') && document.getElementById('footerRegisterLink').addEventListener('click', e => { e.preventDefault(); openAuth('register'); });

    /* Login submit */
    loginForm.addEventListener('submit', e => {
      e.preventDefault();
      const email = document.getElementById('loginEmail').value.trim();
      const pass  = document.getElementById('loginPassword').value;
      const res   = login(email, pass);
      if (res.ok) {
        closeModal();
        window.dispatchEvent(new CustomEvent('auth:change', { detail: res.user }));
        window.showToast(`Welcome back, ${res.user.name.split(' ')[0]}! 👋`);
      } else {
        document.getElementById('loginError').textContent = res.error;
      }
    });

    /* Register submit */
    registerForm.addEventListener('submit', e => {
      e.preventDefault();
      const name  = document.getElementById('regName').value.trim();
      const email = document.getElementById('regEmail').value.trim();
      const pass  = document.getElementById('regPassword').value;
      const res   = register(name, email, pass);
      if (res.ok) {
        closeModal();
        window.dispatchEvent(new CustomEvent('auth:change', { detail: res.user }));
        window.showToast(`Account created! Welcome, ${res.user.name.split(' ')[0]}! 🎉`);
      } else {
        document.getElementById('registerError').textContent = res.error;
      }
    });

    /* Listen for auth changes */
    window.addEventListener('auth:change', () => updateNavAuthBtn());
    updateNavAuthBtn();

    /* open from anywhere */
    window.openAuthModal = openAuth;
  }

  /* ---- Nav Button State ---- */
  function updateNavAuthBtn() {
    const btn  = document.getElementById('authNavBtn');
    const user = current();
    if (!btn) return;
    if (user) {
      btn.title = user.name;
      btn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
          <circle cx="12" cy="7" r="4" fill="currentColor" stroke="none"/>
        </svg>`;
    } else {
      btn.title = 'Account';
      btn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>`;
    }
  }

  /* ---- User Menu ---- */
  let _menuOpen = false;
  let _menuEl = null;

  function toggleUserMenu() {
    if (_menuOpen) { closeUserMenu(); return; }
    const user = current();
    if (!user) return;
    const btn = document.getElementById('authNavBtn');
    _menuEl = document.createElement('div');
    _menuEl.className = 'user-menu-dropdown';
    _menuEl.innerHTML = `
      <div class="user-menu-info">
        <div class="user-menu-name">${user.name}</div>
        <div class="user-menu-email">${user.email}</div>
      </div>
      <button class="user-menu-btn" id="menuWishlist">♡ Wishlist</button>
      <button class="user-menu-btn danger" id="menuLogout">Sign Out</button>
    `;
    btn.style.position = 'relative';
    btn.appendChild(_menuEl);
    requestAnimationFrame(() => _menuEl.classList.add('open'));
    _menuOpen = true;
    _menuEl.querySelector('#menuWishlist').addEventListener('click', () => {
      closeUserMenu();
      window.WISHLIST && window.WISHLIST.openModal();
    });
    _menuEl.querySelector('#menuLogout').addEventListener('click', () => {
      closeUserMenu();
      logout();
      window.showToast('Signed out. See you soon! 👋');
      updateNavAuthBtn();
    });
    setTimeout(() => document.addEventListener('click', outsideClick), 10);
  }

  function closeUserMenu() {
    if (_menuEl) { _menuEl.classList.remove('open'); setTimeout(() => _menuEl && _menuEl.remove(), 200); _menuEl = null; }
    _menuOpen = false;
    document.removeEventListener('click', outsideClick);
  }

  function outsideClick(e) {
    if (_menuEl && !_menuEl.contains(e.target)) closeUserMenu();
  }

  return { init, register, login, logout, current, isLoggedIn };
})();
