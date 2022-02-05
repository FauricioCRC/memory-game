const rootStyles = document.documentElement.style;

const startButton = document.getElementById('start-button');
const board = document.getElementById('board');

const selectGridSize = document.getElementById('grid-size');

const cards = document.getElementsByClassName('card');

const cardsFragment = document.createDocumentFragment();

const stateGameTarget = document.getElementById('state-game-target');



let validatorLose = true;

let lives = document.getElementById('lives');

let boardIndexChilds = [];



const startButtonFunction = () => {
    const gridSize_value = selectGridSize.value;
    const allCells = gridSize_value * gridSize_value;
    startButton.removeEventListener('click', startButtonFunction)
    rootStyles.setProperty('--rows-and-cols', gridSize_value);
    rootStyles.setProperty('--title-color', 'hsl(0, 0%, 85%)');
    rootStyles.setProperty('--lives-active', 'flex');
    
    let time;
    for (let i = 0; i < allCells; i++){
        const card = document.createElement('DIV');
        card.classList.add('card');
        cardsFragment.appendChild(card);
    
    
        boardIndexChilds.push(i);
        
        Number(gridSize_value) === 2 ? 
        (time = 300, lives.textContent = 1) :
        Number(gridSize_value) === 4 ?
        (time = 2600, lives.textContent = 3) :
        (time = 5000, lives.textContent = 10)
    }
    board.appendChild(cardsFragment);
    
    for (let i = 0; i < allCells; i++){
        cards[i].classList.add('rotatedCard');
        setTimeout(() => {
            cards[i].classList.remove('rotatedCard');
        }, time);
    }
    let pos1;
    let pos2;
    
    while (boardIndexChilds.length !== 0){
        for (let i = 0; i < boardIndexChilds.length; i++){
            const numRandom = parseInt(Math.random() * boardIndexChilds.length);
            pos1 = boardIndexChilds[numRandom];
            boardIndexChilds.splice(numRandom, 1);
            
            const numRandom2 = parseInt(Math.random() * boardIndexChilds.length);
            pos2 = boardIndexChilds[numRandom2];
            boardIndexChilds.splice(numRandom2, 1);
    
            const randomIcon = parseInt(Math.random() * 12);
            
            cards[pos1].insertAdjacentHTML('beforeend', `<img class="card__icon" src="assets/icons/${randomIcon}.svg">`);
            cards[pos2].insertAdjacentHTML('beforeend', `<img class="card__icon" src="assets/icons/${randomIcon}.svg">`);
        }
    }
}
startButton.addEventListener('click', startButtonFunction);

selectGridSize.addEventListener('click', () => {
    rootStyles.setProperty('--title-color', 'hsl(0, 0%, 15%)');
    rootStyles.setProperty('--lives-active', 'none');
    rootStyles.setProperty('--state-game-target', 'none');
    boardIndexChilds = [];
    validatorLose = true;
    
    while (board.children.length !== 0){
        for (const cell of board.children){
            cell.remove();
        }
    }
    
    startButton.addEventListener('click', startButtonFunction);
});

const cardsContainer = [];
board.addEventListener('click', (e) => {
    if (e.target.className === 'card' && validatorLose){
        e.target.classList.add('rotatedCard');

        cardsContainer.push(e.target);
        if (cardsContainer.length === 2){
            verifyStateCards(cardsContainer[0], cardsContainer[1]);
            cardsContainer.pop();
            cardsContainer.pop();
        }
    }
});

const verifyStateCards = (card1, card2) => {
    if (card1.children[0].src === card2.children[0].src){
        card1.classList.add('successfullyRotated');
        card2.classList.add('successfullyRotated');
        
        let count = 0;
        for (const card of cards){
            if(card.classList.contains('successfullyRotated')){
                count++;
            }
            if(count === selectGridSize.value * selectGridSize.value){
                rootStyles.setProperty('--state-game-target', 'block');
                stateGameTarget.children[0].textContent = 'You win!!!';
            }
        }
    }
    else{
        card1.classList.add('wronglyRotated');
        card2.classList.add('wronglyRotated');
        
        if (lives.textContent === '1'){
            rootStyles.setProperty('--state-game-target', 'block');
            stateGameTarget.children[0].textContent = 'You lose...';
            lives.textContent -= 1;
            validatorLose = false;
            for (const card of cards){
                card.classList.add('rotatedCard')
            }
        }
        else{
            lives.textContent -= 1;
            setTimeout(() => {
                card1.classList.remove('wronglyRotated', 'rotatedCard');
                card2.classList.remove('wronglyRotated', 'rotatedCard');
            }, 700);
        }
    }
}