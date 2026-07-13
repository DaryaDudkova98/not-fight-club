function updateSettingsPage() {
    const playerName = localStorage.getItem('playerName');
    const nameSpan = document.querySelector('#settings-page .name');
    
    if (nameSpan) {
        if (playerName) {
            nameSpan.textContent = playerName;
        } else {
            nameSpan.textContent = 'Not set';
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
    setTimeout(updateSettingsPage, 100);
    
    const editBtn = document.querySelector('.btn-settings');
    
    if (editBtn) {
        editBtn.addEventListener('click', function() {
            const currentName = localStorage.getItem('playerName') || '';
            const newName = prompt('Enter new character name:', currentName);
            
            if (newName && newName.trim() !== '') {
                const trimmedName = newName.trim();
                localStorage.setItem('playerName', trimmedName);
                
                // Обновляем данные персонажа
                const characterData = JSON.parse(localStorage.getItem('characterData'));
                if (characterData) {
                    characterData.name = trimmedName;
                    localStorage.setItem('characterData', JSON.stringify(characterData));
                }
                
                // Обновляем отображение
                updateSettingsPage();
                updateCharacterPage();
                
                alert(`Name changed to "${trimmedName}"!`);
            }
        });
    }
});