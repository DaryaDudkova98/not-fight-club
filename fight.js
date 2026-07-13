// fight.js - Обработчик кнопки Fight!

document.addEventListener('DOMContentLoaded', function() {
    const fightBtn = document.getElementById('fight-btn');
    
    if (fightBtn) {
        fightBtn.addEventListener('click', function() {
            // Меняем текст и стили кнопки
            this.textContent = 'Fight!';
            this.style.background = 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)';
            this.style.transform = 'scale(1.1)';
            this.style.transition = 'all 0.3s';
            this.style.boxShadow = '0 0 30px rgba(245, 87, 108, 0.6)';
            
            setTimeout(() => {
                alert('⚔️ Battle started!');
                
                const homePage = document.getElementById('home-page');
                if (homePage) {
                    homePage.classList.add('hidden');
                    document.body.style.overflow = 'auto';
                }
                
                setTimeout(() => {
                    resetFightButton();
                }, 300);
                
            }, 1000);
        });
    }
    
    // Функция сброса стилей кнопки
    function resetFightButton() {
        const fightBtn = document.getElementById('fight-btn');
        if (fightBtn) {
            fightBtn.textContent = 'Fight!';
            fightBtn.style.background = '';
            fightBtn.style.transform = 'scale(1)';
            fightBtn.style.boxShadow = 'none';
            fightBtn.style.transition = 'all 0.3s';
        }
    }
});