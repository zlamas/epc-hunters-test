let menu = document.querySelector('[data-menu]');

document.querySelector('[data-menu-open]')
    .addEventListener('click', () => {
        menu.classList.add('menu--open');
    });

document.querySelector('[data-menu-close]')
    .addEventListener('click', () => {
        menu.classList.remove('menu--open');
    });
