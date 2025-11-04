const STORAGE_KEY = 'theme';           // 'light' | 'dark' | null
const mq = window.matchMedia('(prefers-color-scheme: dark)');

function applyTheme(theme, withTransition = false) {
    const root = document.documentElement;
    if (withTransition) {
        root.classList.add('theme-transition');
        window.setTimeout(() => root.classList.remove('theme-transition'), 250);
    }
    root.setAttribute('data-theme', theme);
    updateToggleState(theme);
}

function getSystemTheme() {
    return mq.matches ? 'dark' : 'light';
}

function getActiveTheme() {
    return localStorage.getItem(STORAGE_KEY) || getSystemTheme();
}

function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || getActiveTheme();
    const next = current === 'dark' ? 'light' : 'dark';
    localStorage.setItem(STORAGE_KEY, next);
    applyTheme(next, true);
}

function clearUserChoice() {
    localStorage.removeItem(STORAGE_KEY);
    applyTheme(getSystemTheme(), true);
}

function updateToggleState(theme) {
    const btn = document.getElementById('theme-toggle');
    if (!btn) return;
    btn.setAttribute('aria-pressed', theme === 'dark');
    const sun = btn.querySelector('.icon-sun');
    const moon = btn.querySelector('.icon-moon');
    if (sun && moon) {
        if (theme === 'dark') { sun.style.display = 'none'; moon.style.display = ''; }
        else { sun.style.display = ''; moon.style.display = 'none'; }
    }
}

/** Initialisierung */
export function initThemeToggle() {
    const btn = document.getElementById('theme-toggle');

    // 1) initial (falls Early-Init im <head> fehlt)
    if (!document.documentElement.hasAttribute('data-theme')) {
        applyTheme(getActiveTheme());
    } else {
        updateToggleState(document.documentElement.getAttribute('data-theme'));
    }

    // 2) Button klick
    btn?.addEventListener('click', toggleTheme);

    // 3) Systemwechsel nur übernehmen, wenn der User NICHT manuell überschrieben hat
    mq.addEventListener('change', () => {
        if (!localStorage.getItem(STORAGE_KEY)) {
            applyTheme(getSystemTheme(), true);
        }
    });

    // (Optional) Langdruck auf den Button setzt wieder „System folgen“
    btn?.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        clearUserChoice();
    });
}
