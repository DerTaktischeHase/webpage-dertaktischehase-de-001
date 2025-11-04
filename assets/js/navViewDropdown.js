export function initViewMenu() {
    const viewRoot = document.querySelector('.menu-root');
    if (!viewRoot) return;

    const viewTrigger = viewRoot.querySelector('.menu-trigger');
    const viewMenu    = viewRoot.querySelector('.menu-dropdown');

    function closeViewMenu() {
        viewRoot.classList.remove('open');
        viewTrigger?.setAttribute('aria-expanded', 'false');
        document.removeEventListener('click', onDocClick);
        document.removeEventListener('keydown', onKeydown);
    }

    function onDocClick(e) {
        if (!viewRoot.contains(e.target)) closeViewMenu();
    }

    function onKeydown(e) {
        // ESC → schließt Menü
        if (e.key === 'Escape') {
            closeViewMenu();
            viewTrigger?.focus();
        }

        // einfache Pfeilnavigation ↑ ↓
        if (
            (e.key === 'ArrowDown' || e.key === 'ArrowUp') &&
            viewRoot.classList.contains('open')
        ) {
            e.preventDefault();
            const items = [...viewMenu.querySelectorAll('.menu-item')];
            if (!items.length) return;

            const idx  = items.indexOf(document.activeElement);
            let next = 0;

            if (e.key === 'ArrowDown') {
                next = idx >= 0 ? (idx + 1) % items.length : 0;
            }
            if (e.key === 'ArrowUp') {
                next = idx >= 0 ? (idx - 1 + items.length) % items.length : items.length - 1;
            }

            items[next].focus();
        }
    }

    // Click auf „View“
    viewTrigger?.addEventListener('click', (e) => {
        e.stopPropagation();

        const willOpen = !viewRoot.classList.contains('open');
        if (willOpen) {
            viewRoot.classList.add('open');
            viewTrigger.setAttribute('aria-expanded', 'true');

            // Fokus auf ersten Menüpunkt
            setTimeout(() => viewMenu.querySelector('.menu-item')?.focus(), 0);

            document.addEventListener('click', onDocClick);
            document.addEventListener('keydown', onKeydown);
        } else {
            closeViewMenu();
        }
    });

    // Alt + V = öffnen
    document.addEventListener('keydown', (e) => {
        if (e.altKey && e.key.toLowerCase() === "v") {
            e.preventDefault();
            viewTrigger?.click();
        }
    });
}
