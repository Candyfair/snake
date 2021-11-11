// Génère la grille
function createDiv(value) {
    const grille = document.querySelector('.grid');
    for(let i = 0; i < value; i++) {
        const row = document.createElement("div"); 
        grille.appendChild(row);
    }
}


// Lance le jeu du serpent
document.addEventListener('DOMContentLoaded', () => {

    createDiv(100); // On génère la grille

    const squares = document.querySelectorAll('.grid div');
    const scoreDisplay = document.querySelector('span');
    const startBtn = document.querySelector('.start');

    // Pour changement de couleur du fond
    const grid = document.querySelector('.grid');

    const width = 10;
    let currentIndex = 0; // 1ère div de la grille
    let appleIndex = 0; // 1ère div de la grille
    
    // Création du serpent
    let currentSnake = [2, 1, 0]; // 2 correspond à la tête, 0 à la queue, et 1 au corps
    let direction = 1;
    let score = 0;
    let speed = 0.9;
    let intervalTime = 0;
    let interval = 0;


    // Pour commencer (et recommencer) le jeu
    function startGame() {
        currentSnake.forEach(index => squares[index].classList.remove('snake'));
        squares[appleIndex].classList.remove('apple');
        document.getElementById('gameover').classList.add('hide'); // Cache Game Over
        document.getElementById('footer').style.marginTop = '5em'; // Repositionne le footer
        score = 0;
        direction = 1;
        scoreDisplay.innerText = score;
        intervalTime = 1000;
        currentSnake = [2, 1, 0];
        currentIndex = 0;
        currentSnake.forEach(index => squares[index].classList.add('snake'));
        interval = setInterval(moveOutcomes, intervalTime); 
        randomApple()
    };

    // Fonction qui gère tous les mouvements du serpent
    function moveOutcomes() {

        // Gère quand il touche le bord ou se cogne à lui-même
        if (
            (currentSnake[0] + width >= (width * width) && direction === width) || // Si le serpent se cogne au mur d'en bas
            (currentSnake[0] % width === width -1 && direction === 1) || // Si le serpent se cogne au mur droit
            (currentSnake[0] % width === 0 && direction === -1) || // Si le serpent se cogne au mur gauche
            (currentSnake[0] - width < 0 && direction === -width) || // Si le serpent se cogne au mur d'en haut
            squares[currentSnake[0] + direction].classList.contains('snake') // Si le serpent se rentre dedans
        ) {
            grid.classList.add('blink-lost'); // Clignotement du fond
            setTimeout(() => grid.classList.remove('blink-lost'), 1000); 
            document.getElementById('gameover').classList.remove('hide'); // Game Over
            document.getElementById('footer').style.marginTop = '1.3em';
            return clearInterval(interval); // vide l'intervalle
        }

        const tail = currentSnake.pop(); // Retire la dernière itération du tableau et la montre
        squares[tail].classList.remove('snake'); // Retire la classe 'snake' de la queue
        currentSnake.unshift(currentSnake[0] + direction); // Donne la direction à la tête du tableau

        // Gère quand il attrape une pomme
        if (squares[currentSnake[0]].classList.contains('apple')) {
            squares[currentSnake[0]].classList.remove('apple');

            grid.classList.add('blink-apple');
            setTimeout(() => grid.classList.remove('blink-apple'), 500);

            squares[tail].classList.add('snake');
            currentSnake.push(tail);
            randomApple() // Génère une nouvelle pomme
            score++;
            scoreDisplay.textContent = score;
            clearInterval(interval); // Vide l'intervalle
            intervalTime = intervalTime * speed; // On multiplie l'intervalle par la vitesse
            interval = setInterval(moveOutcomes, intervalTime); // On reset l'intervalle
        };
        squares[currentSnake[0]].classList.add('snake');
    };

    // Générer une nouvelle pomme quand une pomme est mangée
    function randomApple() {
        do {
            appleIndex = Math.floor(Math.random() * squares.length);
        } while (squares[appleIndex].classList.contains('snake')) // On s'assure qu'aucune pomme n'apparaît dans une div où il y a la classe 'snake'
        squares[appleIndex].classList.add('apple')
    }


    // On assigne des fonctions aux touches
    function control(e) {
        squares[currentIndex].classList.remove('snake') // On retire toutes les classes avant chaque mouvement

        if (e.keyCode === 39) {
            direction = 1; // Si on presse la flèche droite, le serpent ira à droite de 1 div
        } else if (e.keyCode === 38) {
            direction = -width; // Si on presse la flèche haut, le serpent reculera de 10 div, donnant l'impression de monter
        } else if (e.keyCode === 37) {
            direction = -1; // Si on presse à gauche, le serpent ira à gauche d'1 div
        } else if (e.keyCode === 40) {
            direction = +width; // Si on presse la flèche bas, la tête du serpent apparaîtra instantanément 10 div sous celle où on est actuellement
        }
    };

    document.addEventListener('keyup', control); // On déclenche la fonction à chaque fois qu'une touche est pressée
    startBtn.addEventListener('click', startGame);




});