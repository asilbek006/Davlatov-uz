/* ============================================================
   Davlatov Asilbek — Portfolio 2026
   i18n Multilingual (UZ, RU, EN) + Theme + Animations
   ============================================================ */

'use strict';

const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* ---------- Theme (dark / light) ---------- */
const root = document.documentElement;

function setTheme(theme) {
    root.dataset.theme = theme;
    try { localStorage.setItem('theme', theme); } catch (e) { /* private mode */ }
}

(function initTheme() {
    let saved = null;
    try { saved = localStorage.getItem('theme'); } catch (e) { /* noop */ }
    const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
    root.dataset.theme = saved || (prefersLight ? 'light' : 'dark');
})();

const themeToggle = $('#themeToggle');
if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark');
    });
}

/* ---------- Mobile menu ---------- */
const burger = $('#burger');
const mobileMenu = $('#mobileMenu');

if (burger && mobileMenu) {
    burger.addEventListener('click', () => {
        burger.classList.toggle('open');
        mobileMenu.classList.toggle('open');
    });
    $$('.mobile-menu a').forEach(a => a.addEventListener('click', () => {
        burger.classList.remove('open');
        mobileMenu.classList.remove('open');
    }));
}

/* ---------- Navbar shadow + scroll progress + back-to-top ---------- */
const navbar = $('#navbar');
const progress = $('#scrollProgress');
const backTop = $('#backTop');

function onScroll() {
    const y = window.scrollY;
    if (navbar) navbar.classList.toggle('scrolled', y > 10);
    if (backTop) backTop.classList.toggle('show', y > 600);
    if (progress) {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        progress.style.width = (max > 0 ? (y / max) * 100 : 0) + '%';
    }
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

if (backTop) {
    backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ---------- Print / Download CV ---------- */
const printCvBtn = $('#printCv');
if (printCvBtn) {
    printCvBtn.addEventListener('click', () => window.print());
}

/* ---------- Reveal on scroll ---------- */
const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('in');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

$$('[data-reveal]').forEach(el => {
    const delay = el.dataset.delay;
    if (delay) el.style.setProperty('--rd', delay + 'ms');
    revealObserver.observe(el);
});

/* ---------- Counters ---------- */
function animateCounter(el) {
    const target = +el.dataset.target;
    const duration = 1500;
    const start = performance.now();

    function tick(now) {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased).toLocaleString('ru-RU').replace(/,/g, ' ');
        if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
}

const counterObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.6 });

$$('.counter').forEach(el => counterObserver.observe(el));

/* ---------- Scrollspy ---------- */
const sections = $$('main section[id]');
const navLinks = $$('.nav-link');

const spyObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            navLinks.forEach(link =>
                link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id)
            );
        }
    });
}, { rootMargin: '-45% 0px -50% 0px' });

sections.forEach(s => spyObserver.observe(s));

/* ============================================================
   i18n Language Switcher (UZ, RU, EN)
   ============================================================ */

let currentLang = 'uz';
let currentRoles = [
    'QA Manual Tester',
    'Manual Test Engineer',
    'Python Dasturchi',
    'Bug Hunter 🐞',
    'Web Dasturchi'
];

function applyLanguage(lang) {
    if (!window.TRANSLATIONS || !window.TRANSLATIONS[lang]) return;
    currentLang = lang;
    const t = window.TRANSLATIONS[lang];
    root.lang = lang;

    // Update active indicators
    const currentLangEl = $('#currentLang');
    if (currentLangEl) currentLangEl.textContent = lang.toUpperCase();

    $$('.lang-opt').forEach(b => b.classList.toggle('active', b.dataset.lang === lang));
    $$('.mobile-lang-btn').forEach(b => b.classList.toggle('active', b.dataset.lang === lang));

    // Update all text elements
    $$('[data-i18n]').forEach(el => {
        const key = el.dataset.i18n;
        if (t[key] !== undefined) {
            el.innerHTML = t[key];
        }
    });

    // Update typewriter roles
    if (Array.isArray(t.roles)) {
        currentRoles = t.roles;
    }

    // Persist
    try { localStorage.setItem('portfolio_lang', lang); } catch (e) { /* private */ }
}

window.showDarslonAlert = function() {
    const t = window.TRANSLATIONS && window.TRANSLATIONS[currentLang];
    const msg = (t && t.proj_darslon_alert) || "darslon.uz platformasi hozirda ishlab chiqish jarayonida! Tez orada to'liq ishga tushadi.";
    alert(msg);
};

// Lang switcher dropdown events
const langSwitcher = $('#langSwitcher');
const langBtn = $('#langBtn');

if (langBtn && langSwitcher) {
    langBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        langSwitcher.classList.toggle('open');
    });

    document.addEventListener('click', (e) => {
        if (!langSwitcher.contains(e.target)) {
            langSwitcher.classList.remove('open');
        }
    });
}

// Bind dropdown options and mobile buttons
$$('.lang-opt, .mobile-lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const lang = btn.dataset.lang;
        applyLanguage(lang);
        if (langSwitcher) langSwitcher.classList.remove('open');
    });
});

// Initialize language from localStorage or default 'uz'
(function initLanguage() {
    let saved = null;
    try { saved = localStorage.getItem('portfolio_lang'); } catch (e) { /* noop */ }
    if (!saved || !['uz', 'ru', 'en'].includes(saved)) {
        saved = 'uz';
    }
    applyLanguage(saved);
})();

/* ---------- Typewriter ---------- */
const typeEl = $('#typewriter');

function typewriter() {
    if (!typeEl) return;
    let roleIdx = 0, charIdx = 0, deleting = false;

    (function loop() {
        const word = currentRoles[roleIdx % currentRoles.length];
        typeEl.textContent = word.slice(0, charIdx);

        let delay = deleting ? 38 : 78;

        if (!deleting && charIdx === word.length) {
            delay = 1800;
            deleting = true;
        } else if (deleting && charIdx === 0) {
            deleting = false;
            roleIdx = (roleIdx + 1) % currentRoles.length;
            delay = 420;
        } else {
            charIdx += deleting ? -1 : 1;
        }
        setTimeout(loop, delay);
    })();
}
typewriter();

/* ---------- QA Terminal animation ---------- */
const terminalBody = $('#terminalBody');
const wait = ms => new Promise(res => setTimeout(res, ms));

function getTerminalLines(lang) {
    const t = (window.TRANSLATIONS && window.TRANSLATIONS[lang]) || (window.TRANSLATIONS && window.TRANSLATIONS.uz) || {};
    return [
        { cls: 'tl-cmd',  text: t.term_cmd || 'qa run --suite biznex-core --verbose', type: true },
        { cls: 'tl-info', text: t.term_start || '▶ Biznex POS test-suite ishga tushirilmoqda...' },
        { cls: 'tl-pass', text: t.term_mod_kassa || 'Kassa moduli .......... PASS' },
        { cls: 'tl-pass', text: t.term_mod_ombor || 'Ombor nazorati ........ PASS' },
        { cls: 'tl-pass', text: t.term_mod_chek  || 'Chek va soliq ......... PASS' },
        { cls: 'tl-pass', text: t.term_mod_osh   || 'Oshxona ekrani ........ PASS' },
        { cls: 'tl-pass', text: t.term_mod_rep   || 'Hisobotlar ............ PASS' },
        { cls: 'tl-ok',   text: t.term_summary   || "8 test o'tdi · 0 xato · 1.24s" },
        { cls: 'tl-info', text: t.term_status    || 'Status: mijozga tayyor ✦' }
    ];
}

async function typeLine(cls, text) {
    if (!terminalBody) return;
    const line = document.createElement('div');
    line.className = cls;
    terminalBody.appendChild(line);
    for (const ch of text) {
        line.textContent += ch;
        await wait(26);
    }
}

async function addLine(cls, text, delay = 320) {
    if (!terminalBody) return;
    const line = document.createElement('div');
    line.className = cls;
    line.textContent = text;
    terminalBody.appendChild(line);
    await wait(delay);
}

async function runTerminal() {
    if (!terminalBody) return;
    // eslint-disable-next-line no-constant-condition
    while (true) {
        terminalBody.innerHTML = '';
        const lines = getTerminalLines(currentLang);
        for (const item of lines) {
            if (item.type) await typeLine(item.cls, item.text);
            else await addLine(item.cls, item.text);
        }
        await wait(4200);
    }
}
runTerminal();

/* ---------- Footer year ---------- */
const yearEl = $('#year');
if (yearEl) yearEl.textContent = new Date().getFullYear();
