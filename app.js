document.addEventListener('DOMContentLoaded', function() {

    const fightBtn = document.getElementById('fight-btn');
    
    if (fightBtn) {
        fightBtn.addEventListener('click', function(e) {
            e.preventDefault();

            const playerName = localStorage.getItem('playerName');
            if (!playerName || playerName.trim() === '') {
                window.location.href = 'registration.html';
                return;
            }

            this.style.transform = 'scale(0.95)';
            this.style.boxShadow = '0 0 50px rgba(245, 87, 108, 0.8)';
            
            setTimeout(() => {
                this.style.transform = 'scale(1)';
                this.style.boxShadow = '0 0 30px rgba(245, 87, 108, 0.4)';
            }, 200);

            if (typeof openPage === 'function') {
                openPage('battle');
            } else {
                console.error('openPage function not found!');
            }
        });
    }
});