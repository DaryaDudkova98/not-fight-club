function updateCharacterPage() {
    const playerName = localStorage.getItem('playerName');

    const nameSpan = document.querySelector('.wrapper-info .name');
    
    if (nameSpan) {
        if (playerName) {
            nameSpan.textContent = playerName;
        } else {
            nameSpan.textContent = 'Unknown Warrior';
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
    setTimeout(updateCharacterPage, 100);
});