// Select elements
const menu = document.getElementById("mobileMenu");
const menuIcon = document.getElementById("menuIcon");

// Toggle mobile menu
function toggleMenu() {
  menu.classList.toggle("active");

  if (menu.classList.contains("active")) {
    menu.style.maxHeight = menu.scrollHeight + "px"; // smooth open
    menuIcon.classList.remove("ri-menu-3-fill");
    menuIcon.classList.add("ri-close-fill");
  } else {
    menu.style.maxHeight = "0px"; // smooth close
    menuIcon.classList.remove("ri-close-fill");
    menuIcon.classList.add("ri-menu-3-fill");
  }
}

// Hamburger click
document.querySelector(".nav3").addEventListener("click", toggleMenu);

// Support clicks on the current `.nav2 h4` items (the markup uses <h4> instead of <a>).
// Smooth scrolling for nav anchor links
document.querySelectorAll('.nav2 a').forEach(link => {
  // ensure pointer cursor if styles didn't apply yet
  link.style.cursor = 'pointer';

  link.addEventListener('click', (e) => {
    const href = link.getAttribute('href');

    // Only intercept in-page hash links
    if (href && href.startsWith('#')) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      } else if (href === '#home') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }

    // Close mobile menu if open
    if (menu.classList.contains('active')) {
      menu.classList.remove('active');
      menu.style.maxHeight = '0px';
      menuIcon.classList.remove('ri-close-fill');
      menuIcon.classList.add('ri-menu-3-fill');
    }
  });
});

// Make Sign In button(s) navigate to signin.html and close mobile menu
document.querySelectorAll('.sign_btn').forEach(btn => {
  btn.style.cursor = 'pointer';
  btn.addEventListener('click', (e) => {
    // Close mobile menu if open for mobile
    if (menu.classList.contains('active')) {
      menu.classList.remove('active');
      menu.style.maxHeight = '0px';
      menuIcon.classList.remove('ri-close-fill');
      menuIcon.classList.add('ri-menu-3-fill');
    }

    // Navigate to sign-in page
    window.location.href = 'signin.html';
  });
});

// Close menu on Escape key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && menu.classList.contains("active")) {
    menu.classList.remove("active");
    menu.style.maxHeight = "0px";
    menuIcon.classList.remove("ri-close-fill");
    menuIcon.classList.add("ri-menu-3-fill");
  }
});

// Reset menu on desktop resize
window.addEventListener("resize", () => {
  if (window.innerWidth > 768) {
    menu.style.maxHeight = null;
    menuIcon.classList.remove("ri-close-fill");
    menuIcon.classList.add("ri-menu-3-fill");
    menu.classList.remove("active");
  }
});

/* -----------------------------
   Callback form handling
   - Saves requests to localStorage as an array under key 'yamloki_messages'
   - Shows a success message to the user
   - Messages can be viewed on messages.html
   ----------------------------- */

const MESSAGES_KEY = 'yamloki_messages';

function loadMessages() {
  try {
    const raw = localStorage.getItem(MESSAGES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Failed to parse messages from storage', e);
    return [];
  }
}

function saveMessage(msg) {
  const list = loadMessages();
  list.unshift(msg); // newest first
  localStorage.setItem(MESSAGES_KEY, JSON.stringify(list));
}

// Hook the callback form if present
const callbackForm = document.getElementById('callbackForm');
if (callbackForm) {
  callbackForm.addEventListener('submit', (ev) => {
    ev.preventDefault();
    const name = (callbackForm.querySelector('#name') || {}).value || '';
    const phone = (callbackForm.querySelector('#phone') || {}).value || '';

    if (!name.trim() || !phone.trim()) {
      const fm = document.getElementById('formMessage');
      if (fm) fm.textContent = 'Please provide name and phone.';
      return;
    }

    const msg = {
      id: Date.now(),
      name: name.trim(),
      phone: phone.trim(),
      timestamp: new Date().toISOString(),
      page: window.location.pathname
    };

    saveMessage(msg);

    const fm = document.getElementById('formMessage');
    if (fm) fm.textContent = 'Thanks! Your request has been recorded. We will contact you soon.';

    // reset form
    callbackForm.reset();

    // Also submit the form to Formsubmit so it emails skulove21@gmail.com
    try {
      // open in a new window/tab; Formsubmit will handle email forwarding
      const win = window.open('', '_blank');
      if (win) {
        // clone the form to the new window and submit it
        const formClone = callbackForm.cloneNode(true);
        // ensure action and target are set (contact.html was updated to Formsubmit action)
        formClone.action = callbackForm.action;
        formClone.method = 'POST';
        formClone.target = '_self';
        // write a minimal document and append the form
        win.document.open();
        win.document.write('<!doctype html><html><head><title>Submitting...</title></head><body></body></html>');
        win.document.close();
        win.document.body.appendChild(formClone);
        formClone.submit();

        // close the tab after a short delay so user isn't left on a blank page (some browsers may block closing)
        setTimeout(() => {
          try { win.close(); } catch (e) { /* ignore */ }
        }, 1500);
      }
    } catch (err) {
      console.warn('Could not submit to Formsubmit automatically, user may need to submit manually.', err);
    }
  });
}

// Render messages on messages.html
function renderMessagesPage() {
  const container = document.getElementById('messagesList');
  if (!container) return;

  const messages = loadMessages();
  if (!messages.length) {
    container.innerHTML = '<p>No messages yet.</p>';
    return;
  }

  const listHtml = messages.map(m => {
    const time = new Date(m.timestamp).toLocaleString();
    return `
      <article class="message-card" style="padding:12px; margin-bottom:12px; background:rgba(255,255,255,0.02); border-radius:6px;">
        <strong>${escapeHtml(m.name)}</strong> — <span style="color:rgba(255,255,255,0.7);">${escapeHtml(m.phone)}</span>
        <div style="font-size:0.9rem; color:rgba(255,255,255,0.6);">${time}</div>
      </article>`;
  }).join('\n');

  container.innerHTML = listHtml;
}

// Simple HTML escaper
function escapeHtml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// If on messages page, render messages
if (window.location.pathname.endsWith('messages.html') || window.location.pathname.endsWith('/messages.html')) {
  renderMessagesPage();
}

/* -----------------------------
   Mock client-side authentication
   - Stores users in localStorage under 'yamloki_users'
   - Stores current session under 'yamloki_user'
   - Protects messages.html by redirecting to signin.html when not authenticated
   ----------------------------- */

const USERS_KEY = 'yamloki_users';
const USER_SESSION = 'yamloki_user';

function loadUsers() {
  try { return JSON.parse(localStorage.getItem(USERS_KEY) || '[]'); }
  catch (e) { return []; }
}

function saveUsers(users) { localStorage.setItem(USERS_KEY, JSON.stringify(users)); }

function setSession(user) { localStorage.setItem(USER_SESSION, JSON.stringify(user)); updateNavAuth(); }
function clearSession() { localStorage.removeItem(USER_SESSION); updateNavAuth(); }
function currentUser() { try { return JSON.parse(localStorage.getItem(USER_SESSION)); } catch (e) { return null; } }

// Protect messages page
if (window.location.pathname.endsWith('messages.html')) {
  const me = currentUser();
  if (!me) {
    // redirect to signin with next param
    window.location.href = 'signin.html?next=messages.html';
  }
}

// Update nav sign button depending on auth state
function updateNavAuth() {
  document.querySelectorAll('.sign_btn').forEach(btn => {
    const me = currentUser();
    if (me) {
      btn.textContent = 'Sign Out';
      btn.onclick = () => { clearSession(); window.location.reload(); };
    } else {
      btn.textContent = 'Sign In';
      btn.onclick = () => { window.location.href = 'signin.html'; };
    }
  });
}

updateNavAuth();

// Auth form handling on signin.html
if (window.location.pathname.endsWith('signin.html')) {
  const showSignIn = document.getElementById('showSignIn');
  const showSignUp = document.getElementById('showSignUp');
  const authForm = document.getElementById('authForm');
  const authSubmit = document.getElementById('authSubmit');
  const authMessage = document.getElementById('authMessage');
  const authTitle = document.getElementById('authTitle');

  let mode = 'signin';
  function setMode(m) {
    mode = m;
    if (mode === 'signup') {
      authSubmit.textContent = 'Create account';
      authTitle.textContent = 'Sign Up';
      showSignUp.style.background = '#24cfa6';
      showSignUp.style.color = '#fff';
      showSignIn.style.background = '#fff';
      showSignIn.style.color = '#000';
    } else {
      authSubmit.textContent = 'Sign In';
      authTitle.textContent = 'Sign In';
      showSignIn.style.background = '#24cfa6';
      showSignIn.style.color = '#fff';
      showSignUp.style.background = '#fff';
      showSignUp.style.color = '#000';
    }
    authMessage.textContent = '';
  }

  showSignIn.addEventListener('click', (e) => { e.preventDefault(); setMode('signin'); });
  showSignUp.addEventListener('click', (e) => { e.preventDefault(); setMode('signup'); });

  authForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = (document.getElementById('authEmail')||{}).value || '';
    const pw = (document.getElementById('authPassword')||{}).value || '';
    if (!email || !pw) { authMessage.textContent = 'Please provide email and password.'; return; }

    const users = loadUsers();
    const existing = users.find(u => u.email === email.toLowerCase());

    if (mode === 'signup') {
      if (existing) { authMessage.textContent = 'An account with that email already exists.'; return; }
      const newUser = { email: email.toLowerCase(), password: pw }; // NOTE: storing password in localStorage (mock only)
      users.push(newUser);
      saveUsers(users);
      setSession({ email: newUser.email });
      authMessage.textContent = 'Account created. You are now signed in.';
      // redirect to 'next' or home
      const params = new URLSearchParams(window.location.search);
      const next = params.get('next') || 'messages.html';
      window.location.href = next;
      return;
    }

    // sign in
    if (!existing || existing.password !== pw) { authMessage.textContent = 'Invalid credentials.'; return; }
    setSession({ email: existing.email });
    authMessage.textContent = 'Signed in.';
    const params = new URLSearchParams(window.location.search);
    const next = params.get('next') || 'messages.html';
    window.location.href = next;
  });

  // initialize mode based on query param
  const params = new URLSearchParams(window.location.search);
  if (params.get('mode') === 'signup') setMode('signup'); else setMode('signin');
}
