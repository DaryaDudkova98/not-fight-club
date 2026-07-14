const pages = {
    'house': {
        id: 'home-page',
        title: 'Main',
        icon: 'fa-house'
    },
    'profile': {
        id: 'character-page',
        title: 'Character',
        icon: 'fa-circle-user'
    },
    'settings': {
        id: 'settings-page',
        title: 'Settings',
        icon: 'fa-gear'
    }
};

const navItems = {
    house: document.getElementById('house'),
    profile: document.getElementById('profile'),
    settings: document.getElementById('settings')
};

function openPage(pageKey) {
    const pageConfig = pages[pageKey];
    if (!pageConfig) return;
    
    // Проверяем имя для защищённых страниц
    if (pageKey === 'profile' || pageKey === 'settings') {
        const playerName = localStorage.getItem('playerName');
        if (!playerName || playerName.trim() === '') {
            window.location.href = 'registration.html';
            return;
        }
    }
    
    document.querySelectorAll('.page').forEach(p => p.classList.add('hidden'));
    
    const targetPage = document.getElementById(pageConfig.id);
    if (targetPage) {
        targetPage.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        updateHeaderTitle(pageConfig.title);
        console.log(`Open page: ${pageConfig.title}`);

        if (pageKey === 'profile') {
            updateCharacterPage();
        }
        if (pageKey === 'settings') {
            updateSettingsPage();
        }
    }
}

function updateHeaderTitle(title) {
    const headerLeft = document.querySelector('.header-left');
    if (headerLeft) {
        let titleSpan = headerLeft.querySelector('.page-title');
        if (!titleSpan) {
            titleSpan = document.createElement('span');
            titleSpan.className = 'page-title';
            headerLeft.appendChild(titleSpan);
        }
        titleSpan.textContent = title;
    }
}

Object.keys(navItems).forEach(key => {
    if (navItems[key]) {
        navItems[key].addEventListener('click', function(e) {
            e.preventDefault();
            openPage(key);
        });
    }
});

function closePage(pageId) {
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }
}

// ИСПРАВЛЕННЫЙ ОБРАБОТЧИК - проверяем, что клик был именно по фону страницы
document.querySelectorAll('.page').forEach(page => {
    page.addEventListener('click', function(e) {
        // Проверяем, что клик был именно по самому элементу .page, а не по его дочерним элементам
        if (e.target === this) {
            // Проверяем, что мы не на странице персонажа и не на странице настроек
            if (this.id === 'character-page' || this.id === 'settings-page') {
                console.log(`Click on ${this.id} background - ignoring`);
                return;
            }
            closePage(this.id);
            const openPages = document.querySelectorAll('.page:not(.hidden)');
            if (openPages.length === 0) {
                updateHeaderTitle('');
            }
        }
    });
});

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        // Не закрываем страницу настроек по Escape, если мы в режиме редактирования
        const settingsPage = document.getElementById('settings-page');
        if (settingsPage && !settingsPage.classList.contains('hidden')) {
            const isEditing = window.isEditingName || false;
            if (isEditing) {
                console.log('Cannot close settings page while editing name');
                return;
            }
        }
        
        document.querySelectorAll('.page:not(.hidden)').forEach(page => {
            closePage(page.id);
        });
        updateHeaderTitle('');
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const playerName = localStorage.getItem('playerName');
    
    if (playerName && playerName.trim() !== '') {
        openPage('house');
    } else {
        window.location.href = 'registration.html';
    }
});