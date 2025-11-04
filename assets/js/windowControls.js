/**
 * Verkabelt Minimieren, Max/Restore (Fullscreen) & "Schließen"-Verhalten
 * @param {{header: HTMLElement, main: HTMLElement, btnMin: HTMLElement, btnMax: HTMLElement, btnClose: HTMLElement}} els
 */
export function setupWindowControls(els) {
    const { header, main, btnMin, btnMax, btnClose } = els;

    // MINIMIZE: nur den main-Inhalt einklappen
    btnMin?.addEventListener('click', () => {
        const minimized = main.classList.toggle('minimized');
        header.classList.toggle('minimized', minimized);
    });

    // MAXIMIZE/RESTORE: Fullscreen API
    btnMax?.addEventListener('click', async () => {
        try {
            if (document.fullscreenElement) {
                await document.exitFullscreen();
                btnMax.setAttribute('data-state', 'maximized'); // Icon: Max
            } else {
                await document.documentElement.requestFullscreen();
                btnMax.setAttribute('data-state', 'restored');  // Icon: Restore
            }
        } catch (e) {
            console.warn('Fullscreen not allowed:', e);
        }
    });

    // CLOSE: nur möglich, wenn via window.open geöffnet
    btnClose?.addEventListener('click', () => {
        if (window.opener && !window.opener.closed) {
            window.close();
        } else {
            // Soft-Close-Strategie (Browser lässt echtes Close nicht zu)
            main.innerHTML = '';
            // Alternativen:
            // location.replace('about:blank'); // Verlaufseintrag ersetzen
            // location.href = '/';             // Startseite deiner Domain
        }
    });
}
