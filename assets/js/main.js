import { setupWindowControls } from './windowControls.js';
import { initThemeToggle } from './theme.js';
import { initViewMenu } from './navViewDropdown.js';

setupWindowControls({
    header:  document.querySelector('.app-menubar'),
    main:    document.querySelector('main'),
    btnMin:  document.querySelector('.wc-min'),
    btnMax:  document.getElementById('wc-max'),
    btnClose:document.querySelector('.wc-close'),
});

initThemeToggle();
initViewMenu();
