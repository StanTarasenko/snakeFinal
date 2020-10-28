let boxSize = 32;
let borderSize = 2;
let gridCount = 13;
let speed = 800;
let processGame, messageBox, startBtn, endBtn, scoreContainer;
let snake = createSnakeData(Math.floor(gridCount / 2), Math.floor(gridCount / 2), 5);
let food = createFood();
let direction = 'left';
let currentScore = 0;
let gridContainer;

console.log(snake);
document.addEventListener('DOMContentLoaded', init);
document.addEventListener('keydown', snakeHandler);

function snakeHandler(event) {
    updateDirection(event);
}

function updateDirection(event) {
    console.log(event.keyCode);
    if (event.keyCode == 37 && direction != 'right')
        direction = 'left';
    if (event.keyCode == 38 && direction != 'down')
        direction = 'up';
    if (event.keyCode == 39 && direction != 'left')
        direction = 'right';
    if (event.keyCode == 40 && direction != 'up')
        direction = 'down';
}



function init() {
    gridContainer = find('#snake-container');
    
    
    let form = find('#controls-form');
    let startBtn = find('#start-game');
    let endBtn = find('#end-game');
    let scoreContainer = find('.score b')
    

    initGrid(gridCount, gridContainer);

    function updateScore(score){
        scoreContainer.innerHTML = score;
    
    }


    function clearSnake() {
        let cells = gridContainer.querySelectorAll('.snake');
        for (const cell of cells) {
            cell.className = 'snake-cell';
        }
        //debugger;
    }
    
    // ----------------------------------------------
    startBtn.addEventListener('click', startHandler);
    endBtn.addEventListener('click', endHandler);
    // игра должнв стартовать и заканчиватся по клику на кнопки 
    // ----------------------------------------------
    function startHandler(){
        startGame();
        let score = find('.score > b');

        score.textContent = '0';
        event.currentTarget.style = 'display:none';
        endBtn.style = 'display: block';
    }

    function endHandler(){
        let messageBox = find('#message')
        endGame(messageBox);
        clearSnake();

        event.currentTarget.style = 'display:none';
        startBtn.style = 'display: block';
    }
    
}

function createSnakeData(cell, row, count) {
    let arr = [];

    for (let index = 0; index < count; index++) {

        arr.push({
            cell: cell + index,
            row
        })
    }

    return arr;
}

function createFood() {
    let food = new Image(boxSize - 7, boxSize - 7);
    food.setAttribute('src', './img/apple.png');
    food.classList.add('snake-food');

    return food;
}



function startGame() {

    let randomBox = generateBoxForEat();
    let score = find('.score > b');
    currentScore = 0;
    score.textContent = currentScore;

    processGame = setInterval(() => {
        let {
            cell,
            row
        } = noWallMode(snake[0]);

        // ----------------------------------
        // Нужно чтобы ф-ция noWallMode (реализует возможность змейки проходить через стены) работала так
        // let {
        //     cell,
        //     row
        // } = noWallMode(snake[0])
        // ----------------------------------

        switch (direction) {
            case 'left': {
                snake.unshift({
                    cell: cell - 1,
                    row
                })
            };
            break;
        case 'up': {
            snake.unshift({
                cell,
                row: row - 1
            })
        };
        break;
        case 'right': {
            snake.unshift({
                cell: cell + 1,
                row
            })
        };
        break;
        case 'down': {
            snake.unshift({
                cell,
                row: row + 1
            })
        };
        break;
        }

        
        console.log(snake[0].cell, snake.length);
        updateSnake();
    }, speed);


    

    function updateSnake() {
        clearSnake();
        checkOnEated(randomBox.dataset);
        checkOnTailCrush();
        
        
        // ---------------------------------------
        // написать ф-цию checkOnEated, которая проверяет съела ли змейка еду, если да добавляет +1 в хвост и в score
        // checkOnEated(randomBox.dataset);
        // ----------------------------------
        function checkOnEated({
            cell,
            row
        }){
        if (snake[0].cell == +cell && snake[0].row == +row){
            score.textContent = `${++currentScore}`;
            randomBox = generateBoxForEat();
        } else {
            snake.pop();
        }
        }


        // ----------------------------------
        // написать ф-цию checkOnTailCrush, которая проверяет врезалась ли голова змейки в себя же, если да - завершить игру
        // checkOnTailCrush();
        // ---------------------------------------

        function checkOnTailCrush() {
            let head = snake[0];

            for(const part of snake.slice(1)){
                if(part.cell == head.cell && part.row == head.row){
                    endGame();    
                }
            }
        }

        for (const [index, snakePart] of snake.entries()) {
            let cell = findByCoords(snakePart.cell, snakePart.row);
            if (index == 0) {
                cell.classList.add('snake-head', 'snake');
            } else {
                cell.classList.add('snake-body', 'snake');
            }

        }
    }

    function clearSnake() {
        let cells = gridContainer.querySelectorAll('.snake');
        for (const cell of cells) {
            cell.className = 'snake-cell';
        }
        //debugger;
    }

    function generateBoxForEat() {
        let cell = getRandomInt(0, gridCount);
        let row = getRandomInt(0, gridCount);
        let randomBox = findByCoords(cell, row);
        randomBox.append(food);
        return randomBox
    }

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }


}
// ----------------------------------
// дополнить эту функцию - вернуть все данные в начальное состояние
// и использовать функцию во всех случаях. где игра завершается
// function endGame(message = 'Game Over!') {
//     clearTimeout(processGame);
// }
// ----------------------------------






function createSnakeRow(snakeClass, gridCount, row) {
    let fragment = new DocumentFragment();

    for (let index = 0; index < gridCount; index++) {
        fragment.append(createSnakeCell(snakeClass, row, index))
    }

    return fragment;
}

function createSnakeCell(snakeClass, row, cell) {
    let div = document.createElement('div');
    div.classList.add(snakeClass);
    div.setAttribute('data-cell', cell);
    div.setAttribute('data-row', row);
    div.style.width = div.style.height = boxSize + 'px';
    return div;
}

function find(selector) {
    return document.querySelector(selector);
}

function findByCoords(cell, row) {
    return document.querySelector(`[data-cell = "${cell}"][data-row = "${row}"]`);
}

function endGame() {
    
    food.remove();
    direction = "left";
    
    clearTimeout(processGame);
    setTimeout(() =>  1000)
}

function noWallMode ({
    cell,
    row
}) {
    if (direction == "left" && cell == 0){
        cell = gridCount
    } else if (direction == "right" && cell == gridCount - 1){
        cell = -1
    }

    if(direction == "up" && row == 0){
        row = gridCount
    } else if (direction == "down" && row == gridCount - 1){
        row = -1
    }
    return {
        cell,
        row
    }
}

function initGrid(gridCount, target) {
    target.style.width = target.style.height = (boxSize * gridCount) + 'px';

    for (let index = 0; index < gridCount; index++) {
        target.append(createSnakeRow('snake-cell', gridCount, index));
    }
}