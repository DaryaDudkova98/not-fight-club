const btnregistr = document.getElementById('btn-registraion');
const inputName = document.getElementById('name');

function getValue() {
    let value = inputName.value;
    let name = value.trim();
    return name;
}

btnregistr.addEventListener('click', function(e) {
    e.preventDefault();

    const playerName = getValue();

    if (playerName === '') {
        alert('Please enter a character name!');
        inputName.focus();
        return;
    }
    
    localStorage.setItem('playerName', playerName);

    const characterData = {
        name: playerName,
        createdAt: new Date().toISOString(),
        wins: 0,
        losses: 0
    };
    localStorage.setItem('characterData', JSON.stringify(characterData));
    
    console.log('Character name:', playerName);
    alert(`Character "${playerName}" created successfully!`);

    window.location.href = 'index.html';
});

inputName.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
        btnregistr.click();
    }
});