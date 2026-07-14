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
    const nameSpan = document.querySelector('#settings-page .name');
    const settingsWrapper = document.querySelector('.wrapper-settings');
    
    if (editBtn) {
        let isEditing = false;
        let input = null;
        
        // Функция для сохранения имени
        function saveName() {
            if (!input) return;
            
            const newName = input.value.trim();
            
            if (newName === '') {
                input.style.borderColor = '#ff4757';
                input.placeholder = 'Name cannot be empty!';
                setTimeout(() => {
                    input.style.borderColor = '#00a2ff';
                    input.placeholder = 'Enter character name...';
                }, 2000);
                return;
            }
            
            // Сохраняем имя
            localStorage.setItem('playerName', newName);
            
            // Обновляем данные персонажа
            const characterData = JSON.parse(localStorage.getItem('characterData'));
            if (characterData) {
                characterData.name = newName;
                localStorage.setItem('characterData', JSON.stringify(characterData));
            }
            
            // Возвращаем span с новым именем
            nameSpan.textContent = newName;
            nameSpan.style.display = 'inline-block'; // или 'inline'
            
            // Удаляем input
            if (input.parentNode) {
                input.parentNode.removeChild(input);
            }
            input = null;
            
            // Возвращаем кнопку в исходное состояние
            editBtn.textContent = 'Edit';
            editBtn.style.cssText = ''; // Сброс стилей
            
            isEditing = false;
            
            // Обновляем страницу персонажа
            if (typeof updateCharacterPage === 'function') {
                updateCharacterPage();
            }
        }
        
        editBtn.addEventListener('click', function() {
            if (isEditing) {
                // Если уже в режиме редактирования - сохраняем
                saveName();
                return;
            }
            
            const currentName = localStorage.getItem('playerName') || '';
            
            // Создаем поле ввода
            input = document.createElement('input');
            input.type = 'text';
            input.value = currentName;
            input.placeholder = 'Enter character name...';
            input.style.cssText = `
                padding: 8px 12px;
                border: 2px solid #00a2ff;
                border-radius: 8px;
                background: #ffffff;
                color: #000000;
                font-size: 16px;
                outline: none;
                width: 200px;
                font-family: inherit;
                transition: border-color 0.3s ease;
                box-sizing: border-box;
            `;
            
            // Скрываем span и вставляем input на его место
            nameSpan.style.display = 'none';
            
            // Вставляем input перед span
            nameSpan.parentNode.insertBefore(input, nameSpan);
            
            // Фокусируемся на input
            setTimeout(() => {
                input.focus();
                input.select();
            }, 50);
            
            // Меняем текст кнопки
            editBtn.textContent = 'Save';
            
            
            isEditing = true;
            
            // Сохранение по Enter
            input.addEventListener('keydown', function(e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    saveName();
                }
            });
            
        });
    }
});