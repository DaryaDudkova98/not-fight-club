let playerHealth = 150;
let enemyHealth = 100;
let maxPlayerHealth = 150;
let maxEnemyHealth = 100;
let isPlayerTurn = true;
let isDefending = false;
let battleActive = false;

// Выбранные зоны
let selectedAttackZone = null;
let selectedDefenceZones = [];

const zones = ['head', 'neck', 'body', 'belly', 'legs'];

const BASE_DAMAGE = 10;

const enemies = {
    'Levi Akkerman': {
        avatar: 'LeviAkkerman.png',
        health: 100
    },
    'Spacemarine': {
        avatar: 'Spacemarine.png',
        health: 100
    },
    'Spider': {
        avatar: 'spider_100.png',
        health: 100
    },
    'Porko Galyard': {
        avatar: 'PorkoGalyard.jpg',
        health: 100
    }
};

function initBattle() {
    // Загружаем данные игрока
    const playerName = localStorage.getItem('playerName') || 'Player';
    const playerAvatar = localStorage.getItem('selectedAvatar') || 'img/avatars/default.jpg';

    // Обновляем информацию об игроке
    const playerNameEl = document.getElementById('player-fighter-name');
    const playerAvatarEl = document.getElementById('player-fighter-avatar');
    if (playerNameEl) playerNameEl.textContent = playerName;
    if (playerAvatarEl) playerAvatarEl.src = playerAvatar;

    // Сбрасываем здоровье игрока
    playerHealth = 150;
    maxPlayerHealth = 150;
    isPlayerTurn = true;
    isDefending = false;
    battleActive = true;

    // Сбрасываем выбор зон
    selectedAttackZone = null;
    selectedDefenceZones = [];

    // CHANGE ENEMIES
    const enemyNames = Object.keys(enemies);
    const randomEnemyName = enemyNames[Math.floor(Math.random() * enemyNames.length)];
    const selectedEnemy = enemies[randomEnemyName];

    const enemyNameEl = document.getElementById('enemy-fighter-name');
    if (enemyNameEl) {
        enemyNameEl.textContent = randomEnemyName;
    }

    const enemyAvatarEl = document.getElementById('enemy-fighter-avatar');
    if (enemyAvatarEl) {
        enemyAvatarEl.src = 'img/enemies/' + selectedEnemy.avatar;
    }

    enemyHealth = selectedEnemy.health;
    maxEnemyHealth = selectedEnemy.health;

    updateHealthBars();

    // Очищаем лог боя
    const log = document.getElementById('battle-log');
    if (log) {
        log.innerHTML = '';
    }

    const modal = document.getElementById('battleResultModal');
    if (modal) {
        modal.style.display = 'none';
    }

    resetZoneSelection();

    enableZoneButtons(true);

    const attackBtn = document.getElementById('attack-btn');
    if (attackBtn) {
        attackBtn.disabled = true;
    }
}

function resetZoneSelection() {
    document.querySelectorAll('.zone-btn').forEach(btn => {
        btn.classList.remove('selected');
    });

    selectedAttackZone = null;
    selectedDefenceZones = [];
}

function enableZoneButtons(enabled) {
    document.querySelectorAll('.zone-btn').forEach(btn => {
        btn.disabled = !enabled;
    });
}

function updateHealthBars() {
    const playerHealthPercent = Math.max(0, (playerHealth / maxPlayerHealth) * 100);

    const enemyHealthPercent = Math.max(0, (enemyHealth / maxEnemyHealth) * 100);

    const playerHealthEl = document.getElementById('player-health');
    const enemyHealthEl = document.getElementById('enemy-health');
    const playerHealthText = document.getElementById('player-health-text');
    const enemyHealthText = document.getElementById('enemy-health-text');

    if (playerHealthEl) playerHealthEl.style.width = playerHealthPercent + '%';
    if (enemyHealthEl) enemyHealthEl.style.width = enemyHealthPercent + '%';

    if (playerHealthText) {
        playerHealthText.textContent = `${Math.max(0, Math.round(playerHealth))}/${maxPlayerHealth} HP`;
    }
    if (enemyHealthText) {
        enemyHealthText.textContent = `${Math.max(0, Math.round(enemyHealth))}/${maxEnemyHealth} HP`;
    }

    if (playerHealthEl) updateHealthColor(playerHealthEl, playerHealth, maxPlayerHealth);
    if (enemyHealthEl) updateHealthColor(enemyHealthEl, enemyHealth, maxEnemyHealth);
}

function updateHealthColor(healthBar, health, maxHealth) {
    const percent = (health / maxHealth) * 100;
    if (percent > 60) {
        healthBar.style.background = 'linear-gradient(90deg, #2ecc71, #27ae60)';
    } else if (percent > 30) {
        healthBar.style.background = 'linear-gradient(90deg, #f1c40f, #f39c12)';
    } else {
        healthBar.style.background = 'linear-gradient(90deg, #ff4757, #c0392b)';
    }
}

function addLogMessage(message, type = 'system-message') {
    const log = document.getElementById('battle-log');
    if (!log) return;
    const p = document.createElement('p');
    p.className = type;
    p.textContent = message;
    log.appendChild(p);
    log.scrollTop = log.scrollHeight;
}

function handleZoneSelection(type, zone) {
    if (!battleActive) return;

    if (type === 'attack') {
        if (selectedAttackZone === zone) {
            selectedAttackZone = null;
            const btn = document.querySelector(`.attack-zone[data-zone="${zone}"]`);
            if (btn) btn.classList.remove('selected');
        } else {
            document.querySelectorAll('.attack-zone').forEach(btn => {
                btn.classList.remove('selected');
            });
            selectedAttackZone = zone;
            const btn = document.querySelector(`.attack-zone[data-zone="${zone}"]`);
            if (btn) btn.classList.add('selected');
        }
    } else if (type === 'defence') {
        const btn = document.querySelector(`.defence-zone[data-zone="${zone}"]`);

        if (selectedDefenceZones.includes(zone)) {
            selectedDefenceZones = selectedDefenceZones.filter(z => z !== zone);
            if (btn) btn.classList.remove('selected');
        } else if (selectedDefenceZones.length < 2) {
            selectedDefenceZones.push(zone);
            if (btn) btn.classList.add('selected');
        } else {
            addLogMessage('You can only select 2 defence zones!', 'system-message');
            return;
        }
    }

    const attackBtn = document.getElementById('attack-btn');
    if (attackBtn) {
        if (selectedAttackZone && selectedDefenceZones.length === 2) {
            attackBtn.disabled = false;
        } else {
            attackBtn.disabled = true;
        }
    }
}

// Проверка критического удара
function isCriticalHit() {
    return Math.random() < 0.2;
}

function playerAttack() {
    if (!isPlayerTurn || !battleActive) return;
    if (playerHealth <= 0 || enemyHealth <= 0) return;

    if (!selectedAttackZone || selectedDefenceZones.length !== 2) {
        addLogMessage('Select 1 Attack zone and 2 Defence zones!', 'system-message');
        return;
    }

    enableZoneButtons(false);
    const attackBtn = document.getElementById('attack-btn');
    if (attackBtn) attackBtn.disabled = true;

    const playerName = document.getElementById('player-fighter-name')?.textContent || 'Player';
    const enemyName = document.getElementById('enemy-fighter-name')?.textContent || 'Enemy';

    let damage = BASE_DAMAGE;
    let isCritical = false;

    // Проверяем критический удар
    if (isCriticalHit()) {
        isCritical = true;
        damage = Math.floor(damage * 1.5);
    }

    const enemyDefenceZones = getRandomDefenceZones();
    const isBlocked = enemyDefenceZones.includes(selectedAttackZone);

    let logEntry = '';

    if (isCritical) {
        // КРИТИЧЕСКИЙ УДАР - пробивает блок
        logEntry = `${playerName} attacked ${enemyName} to ${selectedAttackZone.toUpperCase()} | Damage: ${damage} | CRITICAL (Bypassed block!)`;
        addLogMessage(logEntry, 'player-action');
        enemyHealth = Math.max(0, enemyHealth - damage);
    } else if (isBlocked) {
        // ОБЫЧНЫЙ УДАР - ЗАБЛОКИРОВАН
        logEntry = `${playerName} attacked ${enemyName} to ${selectedAttackZone.toUpperCase()} | Damage: 0 | BLOCKED by ${enemyName} (defended: ${enemyDefenceZones.join(', ').toUpperCase()})`;
        addLogMessage(logEntry, 'enemy-action');
        // Урон не наносится
    } else {
        // ОБЫЧНЫЙ УДАР - НЕ ЗАБЛОКИРОВАН
        logEntry = `${playerName} attacked ${enemyName} to ${selectedAttackZone.toUpperCase()} | Damage: ${damage} | HIT!`;
        addLogMessage(logEntry, 'player-action');
        enemyHealth = Math.max(0, enemyHealth - damage);
    }

    updateHealthBars();
    addLogMessage(`${playerName} HP: ${playerHealth} | ${enemyName} HP: ${enemyHealth}`, 'system-message');

    // Проверка победы
    if (enemyHealth <= 0) {
        addLogMessage(`VICTORY! ${playerName} defeated ${enemyName}!`, 'system-message');
        showBattleResult(true);
        endBattle(true);
        return;
    }

    isPlayerTurn = false;
    setTimeout(() => enemyTurn(), 1000);
}

function getRandomDefenceZones() {
    const shuffled = [...zones].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 2);
}

function enemyTurn() {
    if (!battleActive) return;
    if (playerHealth <= 0 || enemyHealth <= 0) return;

    const playerName = document.getElementById('player-fighter-name')?.textContent || 'Player';
    const enemyName = document.getElementById('enemy-fighter-name')?.textContent || 'Enemy';

    const enemyAttackZone = zones[Math.floor(Math.random() * zones.length)];

    let damage = BASE_DAMAGE;
    let isCritical = false;

    if (isCriticalHit()) {
        isCritical = true;
        damage = Math.floor(damage * 1.5);
    }

    const isBlocked = selectedDefenceZones.includes(enemyAttackZone);

    let logEntry = '';

    if (isCritical) {
        // КРИТИЧЕСКИЙ УДАР - пробивает блок
        logEntry = `${enemyName} attacked ${playerName} to ${enemyAttackZone.toUpperCase()} | Damage: ${damage} | CRITICAL (Bypassed block!)`;
        addLogMessage(logEntry, 'enemy-action');
        playerHealth = Math.max(0, playerHealth - damage);
    } else if (isBlocked) {
        // ОБЫЧНЫЙ УДАР - ЗАБЛОКИРОВАН
        logEntry = `${enemyName} attacked ${playerName} to ${enemyAttackZone.toUpperCase()} | Damage: 0 | BLOCKED by ${playerName} (defended: ${selectedDefenceZones.join(', ').toUpperCase()})`;
        addLogMessage(logEntry, 'player-action');
        // Урон не наносится
    } else {
        // ОБЫЧНЫЙ УДАР - НЕ ЗАБЛОКИРОВАН
        logEntry = `${enemyName} attacked ${playerName} to ${enemyAttackZone.toUpperCase()} | Damage: ${damage} | HIT!`;
        addLogMessage(logEntry, 'enemy-action');
        playerHealth = Math.max(0, playerHealth - damage);
    }

    updateHealthBars();
    addLogMessage(`${playerName} HP: ${playerHealth} | ${enemyName} HP: ${enemyHealth}`, 'system-message');

    // Проверка поражения
    if (playerHealth <= 0) {
        addLogMessage(`DEFEAT! ${playerName} was defeated by ${enemyName}!`, 'system-message');
        showBattleResult(false);
        endBattle(false);
        return;
    }

    enableZoneButtons(true);
    resetZoneSelection();
    const attackBtn = document.getElementById('attack-btn');
    if (attackBtn) attackBtn.disabled = true;
    isPlayerTurn = true;

    addLogMessage(`Your turn! Select zones and attack!`, 'system-message');
}

// ФУНКЦИЯ ПОКАЗА МОДАЛЬНОГО ОКНА
function showBattleResult(victory) {
    const modal = document.getElementById('battleResultModal');
    const message = document.getElementById('battleResultMessage');
    const closeBtn = document.getElementById('battleResultClose');

    if (!modal) {
        createBattleResultModal();
        return showBattleResult(victory);
    }

    if (victory) {
        message.textContent = 'Congratulations with your win!';
        message.style.color = '#000000';
        message.style.fontSize = '24px';
        message.style.fontWeight = 'bold';
        message.style.textAlign = 'center';
    } else {
        message.textContent = 'Maybe next time :(';
        message.style.color = '#000000';
        message.style.fontSize = '24px';
        message.style.fontWeight = 'bold';
        message.style.textAlign = 'center';
    }

    modal.style.display = 'flex';

    if (closeBtn) {
        closeBtn.onclick = function () {
            modal.style.display = 'none';
            openPage('home');
        };
    }

    modal.onclick = function (e) {
        if (e.target === modal) {
            modal.style.display = 'none';
            openPage('home');
        }
    };
}


function createBattleResultModal() {
    const modalHTML = `
        <div id="battleResultModal" class="modal-overlay" style="display:none;">
            <div class="modal-content battle-result-modal">
                <button class="modal-close-btn" id="battleResultClose">
                    <i class="fas fa-times"></i>
                </button>
                <p id="battleResultMessage">🏆 Congratulations with your win!</p>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

function endBattle(victory) {
    battleActive = false;

    enableZoneButtons(false);
    const attackBtn = document.getElementById('attack-btn');
    if (attackBtn) attackBtn.disabled = true;

    const characterData = JSON.parse(localStorage.getItem('characterData')) || { wins: 0, loses: 0 };
    if (victory) {
        characterData.wins = (characterData.wins || 0) + 1;
    } else {
        characterData.loses = (characterData.loses || 0) + 1;
    }
    localStorage.setItem('characterData', JSON.stringify(characterData));

    updateCharacterPage();
}

function updateCharacterPage() {
    const characterData = JSON.parse(localStorage.getItem('characterData')) || { wins: 0, loses: 0 };
    const name = localStorage.getItem('playerName') || 'Player';
    const avatar = localStorage.getItem('selectedAvatar') || 'img/avatars/default.jpg';

    const nameElements = document.querySelectorAll('.name');
    nameElements.forEach(el => {
        if (el) el.textContent = name;
    });

    const avatarElements = document.querySelectorAll('.img-charachter');
    avatarElements.forEach(el => {
        if (el) el.src = avatar;
    });

    const winsElements = document.querySelectorAll('.wins-count');
    winsElements.forEach(el => {
        if (el) el.textContent = characterData.wins || 0;
    });

    const losesElements = document.querySelectorAll('.loses-count');
    losesElements.forEach(el => {
        if (el) el.textContent = characterData.loses || 0;
    });
}

document.addEventListener('DOMContentLoaded', function () {

    updateCharacterPage();

    document.querySelectorAll('.attack-zone').forEach(btn => {
        btn.addEventListener('click', function () {
            const zone = this.dataset.zone;
            handleZoneSelection('attack', zone);
        });
    });

    document.querySelectorAll('.defence-zone').forEach(btn => {
        btn.addEventListener('click', function () {
            const zone = this.dataset.zone;
            handleZoneSelection('defence', zone);
        });
    });

    const attackBtn = document.getElementById('attack-btn');
    if (attackBtn) {
        attackBtn.addEventListener('click', playerAttack);
    }

    const backBtn = document.getElementById('back-to-home');
    if (backBtn) {
        backBtn.addEventListener('click', function () {
            openPage('home');
        });
    }
});