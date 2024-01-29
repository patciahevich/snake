const gameBoard = document.querySelector('.game');
const myScore = document.querySelector('.score');

const newGameBtn = document.querySelectorAll('.newGame');
const recordsBtn = document.querySelectorAll('.records');

const modal = document.querySelector('.modal');
const popUp = document.querySelector('.pop_up');
const gameOver = document.querySelector('.game_over');
const closeBtn = document.querySelectorAll('.close')
const recordBoard = document.querySelector('.records_board')

const finishScore  = document.querySelector('.finish_score')


recordsBtn.forEach(function(item) {
    item.addEventListener('click', function() {
        closeModal();
        showRecords();
    });
});

closeBtn.forEach(function(item) {
    item.addEventListener('click', closeModal)
});

newGameBtn.forEach(function(item) {
    item.addEventListener('click', restartGame);
});

modal.addEventListener('click', function(event) {
    if (event.target == modal) {
      closeModal();  
    }
    
});

function showRecords() {
    modal.classList.add('active');
    popUp.classList.add('active');
    setTimeout(function() {
        popUp.classList.add('fadeIn')
    }, 100)
}

function closeModal() {
    modal.classList.remove('active');
    popUp.classList.remove('active');
    popUp.classList.remove('fadeIn');
    gameOver.classList.remove('active');
    gameOver.classList.remove('fadeIn');
}

const context = gameBoard.getContext('2d');

const eatAudio = new Audio();
eatAudio.src = 'audio/eating.mp3';

const finishAudio = new Audio();
finishAudio.src = 'audio/finish.mp3'

const foodImg = new Image();
foodImg.src = "img/pizza32.png";

const gameBoardWidth = gameBoard.width;
const gameBoardHeight = gameBoard.height;
let boxSize = 32;

let score = 0;
let game;

let snake = [];
snake[0] = {
    x : 5 * boxSize,
    y : 5 * boxSize,
}

let food = getRandomCoordinates();

let dir;

function knowDir(e) { // узнать, кака клавиша была нажата и присвоить ее значение в dir
	if(e.keyCode == 37 && dir != "right") { // двойная проверка, чтобы избужать резкой смены движения
      dir = "left";  
    } else if (e.keyCode == 38 && dir != "down") {
       dir = "up"; 
    } else if (e.keyCode == 39 && dir != "left") {
      dir = "right";  
    } else if (e.keyCode == 40 && dir != "up") {
      dir = "down";  
    }
}

document.addEventListener("keydown", knowDir);

function eatTail(head, arr) { // проверка, что змея ест свой хвостик
	for(let i = 0; i < arr.length; i++) {
		if(head.x == arr[i].x && head.y == arr[i].y) {
            clearInterval(game); 
            setTimeout(finishGame, 200)
        }
			
	}
}
addRecord()

function drawBoard() {
    context.fillStyle = '#f0ddef';
    context.fillRect(0, 0, gameBoardWidth, gameBoardHeight);
    context.drawImage(foodImg, food.x, food.y);

    for (let i = 0; i < snake.length; i++) {
        if (i === 0) {  // цвет головы отличается
            context.fillStyle = '#f54ecb';
        } else {
            context.fillStyle = '#f086d5'
        }   
        context.fillRect(snake[i].x, snake[i].y, boxSize, boxSize)
    }

    myScore.textContent = score;

    // координаты первого элемнта змейки
    let snakeX = snake[0].x;
	let snakeY = snake[0].y;


	if(snakeX == food.x && snakeY == food.y) { // проверка, что змейка ест еду
        eatAudio.play();
		score++;
		food = getRandomCoordinates(); // тут хвост не удаляется, т.к. змейка съeла еду
	} else {
        snake.pop(); // движение змейки
    }

    if (dir == "left") {
        snakeX -= boxSize;  
      } else if (dir == "right") {
          snakeX += boxSize;
      } else if(dir == "up") {
          snakeY -= boxSize;
      } else if (dir == "down") {
          snakeY += boxSize;
      }

    if (snakeX < 0 || snakeX >= gameBoardWidth || snakeY < 0 || snakeY >= gameBoardHeight) {
        clearInterval(game); 
        setTimeout(finishGame, 200)
    }

    let newHead = {
		x: snakeX,
		y: snakeY
	};

	eatTail(newHead, snake);

	snake.unshift(newHead);
    
}

function finishGame() {
    finishAudio.play();
    finishScore.textContent = `Your score is ${score}`
    modal.classList.add('active');
    gameOver.classList.add('active');
    setTimeout(function() {
        gameOver.classList.add('fadeIn');
    }, 100)
    addRecord();
    dir = null;
}

window.addEventListener('load', restartGame)


function restartGame() {
    dir = null;
    clearInterval(game); 
    closeModal();
    score = 0;
    snake = [];
    snake[0] = {
        x : 10 * boxSize,
        y : 10 * boxSize,
    }
    game = setInterval(drawBoard, 100)
}

function addRecord() {
    killRecord()
    let records = JSON.parse(localStorage.getItem('records')) || [];
    if (!records.includes(score)) {
        records.push(score)
    }
    records.sort( (a, b) => b - a)
    if (records.length > 10) {
        records.pop()
    }
    for (let i = 0; i < 10; i++) {
        writeRecord(records[i])
    }
    localStorage.setItem('records', JSON.stringify(records));

}

function writeRecord(el) {
    const li = document.createElement('li');
    li.textContent = el;
    recordBoard.append(li)
}

function killRecord() {
    while(recordBoard.firstChild) {
        recordBoard.removeChild(recordBoard.firstChild)
    }
}

function getRandomCoordinates() {
    let x = Math.floor(Math.random() * (gameBoardWidth / boxSize)) * boxSize;
    let y = Math.floor(Math.random() * (gameBoardWidth / boxSize)) * boxSize;
    let isPartOfSnake = !!snake.find((snakePart) => snakePart.x === x && snakePart.y === y)

    if (isPartOfSnake) {
        return  getRandomCoordinates()
    }

    return { x, y };
}








