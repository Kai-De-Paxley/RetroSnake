//pertama target dulu element yang ingin diubah 
const boardGame = document.getElementById('game-board-play');
const instructionText = document.getElementById('instruction-text')
const logo = document.getElementById('logo')
const score = document.getElementById('score');
const highScoreText = document.getElementById('highScores');
const controls = document.querySelectorAll('.controls button')
const start = document.getElementById('start')

//buat variabel untuk snake food and other 
const gridSize = 20;
let snakeBody = [{x: 4, y: 10}];
let food = randomFood();
let highScore = 0;
let direction = 'right';
let gameInterval;
let snakeSpeed = 180;
let gameStart = false;


//membuat function untuk membuat snake food dan game map 
function draw() {
    boardGame.innerHTML = '';
    makeSnake()
    makeFood()
    Scores()
    
}

function makeSnake() {
        //forEach berarti mengakses semua nilai array (disini berati hanya 1 objek{x: 4, y:10})
        //segment disini berarti parameter menyimpan value dari snakebody yang akan dirubah
        snakeBody.forEach((segment) => {
        //creatGameElement adalah function untuk membuat div dan class dengan parameter tag dan classname(belum berfungsi jika parameter belum di deklarasikan )
        const snakeBodyElement = creatGameElement('div','snake');
        //memanggil funtion untuk posisi snake and food
        setPosition(snakeBodyElement, segment);
        boardGame.appendChild(snakeBodyElement);
    }); 
    
}

//untuk membuat snake dan food dengan div
function creatGameElement(tag, ClassElement) {
    //disini untuk membuat elemnt div dengan tag sudah di deklarasikan dengan .createElement. tag === 'div'
    const element = document.createElement(tag);
    element.className = ClassElement;
    return element
}

//set posisi untuk ular dan food
function setPosition(styleElement, position) {
    //ini akan membuat posisinya sesuai dengan x (position = segment = snakeBody)
    //styleElement = snakeBodyElement = div
    styleElement.style.gridColumn = position.x; //----
    styleElement.style.gridRow = position.y; // !!!!
}



//untuk membuat makanan 
function makeFood(){
    const foodElement = creatGameElement('div', 'food');
    setPosition(foodElement, food);
    boardGame.appendChild(foodElement);
}

//untuk membuat makanan muncul secara random 
function randomFood() {
    const x = Math.floor(Math.random() * gridSize) + 1;
    const y = Math.floor(Math.random() * gridSize) + 1;
    return {x, y};
}

//untuk membuat ular bergerak
function move() {
    //ini berarti membuat salinan dari snakebody tanpa merubah yang orinya (sparade operator)
    const head = { ...snakeBody[0] };
    switch (direction) {// 
        case 'right':         
            head.x += 1
            break;
        case 'left':             
            head.x -= 1
            break;
        case 'up':                         
            head.y -= 1
            break;
        case 'down':                      
            head.y += 1 
            break;
    }
    console.log(head)
    

    snakeBody.unshift(head)//unsift disini berarti memasukkan object baru pada head atau snakebody jika swithc dijalankan berarti object baru (diawal) akan ditambahkan ke snake 
    
    //snakeBody.pop() //untuk menghapus objeck terakhir

    if(head.x === food.x && head.y === food.y) {
        food = randomFood();
        incresedSpeed()
        clearInterval(gameInterval)
        gameInterval = setInterval(() => {
            move()
            draw()
            chechCrash()
        }, snakeSpeed) 
    } else (
        snakeBody.pop()
    )
}

//mulai game 
function startGame () {
    gameStart = true;// berarti kalau true game akan terus berjalan
    instructionText.style.display = 'none'
    start.style.display ='none'
    logo.style.display = 'none'
    gameInterval = setInterval(() =>{
        move()
        draw()
        chechCrash();
    }, snakeSpeed);
}

let lastDirection = 'right'
// key press event listener (controlloer) 
function handleKeyPress(event) {
    lastDirection = direction
    //kalau game belum mualai dan gak tekan space maka kode dibawah dijalan
    if(!gameStart && event.code === 'Space') {
        startGame();
    } else {
        switch(event.key) {
            case 'ArrowUp':
            if( lastDirection === 'down') break
             direction = 'up'
             break;
            case 'ArrowDown':
                if( lastDirection === 'up') break
             direction = 'down'
             break;
            case 'ArrowRight':
                if( lastDirection === 'left') break
             direction = 'right'
             break;
            case 'ArrowLeft':
                if( lastDirection === 'right') break
             direction = 'left'
             break;
        }
        console.log(event.key)
        console.log(lastDirection)
    }
}

document.addEventListener('keydown', handleKeyPress)

controls.forEach(key => {
    key.addEventListener('click', () => handleKeyPress({key: key.dataset.key, code: key.dataset.code}))
})

//mengatur kecepatan ular jika semakin besar semakin cepat
function incresedSpeed() {
    if(snakeSpeed > 150) {
        snakeSpeed -= 5
        console.log(snakeSpeed)
    } else if ( snakeSpeed > 100) {
        snakeSpeed -= 3
    } else if (snakeSpeed > 25) {
        snakeSpeed -= 1
    }
}

// untuk mengechek apakah kenak tembok apa ngakk 
function chechCrash() {
    const head = snakeBody[0];

    if(head.x < 1 || head.x > gridSize || head.y < 1 || head.y > gridSize ) {
        resetGame()
    }
    for(let i = 1; i < snakeBody.length; i++) {
        if( head.x === snakeBody[i].x && head.y === snakeBody[i].y){
            resetGame()
        }
    }
}

//untuk reset game kalau kenak tembok 
function resetGame () {
    highScoreUpdate()
    snakeBody = [{x: 4, y: 10}];
    food = randomFood()
    snakeSpeed = 200
    direction = 'right'
    Scores()
    stopGame()
}

function Scores() {
    const currentScore = snakeBody.length - 1
    score.textContent = currentScore.toString().padStart(3, '0')
}

function highScoreUpdate() {
    const currentScore = snakeBody.length - 1;
    console.log(currentScore)
    if(currentScore > highScore){
        highScore += currentScore
        highScoreText.innerText = highScore
        highScoreText.style.display = 'block'
    }
    
}

//untuk tampilan awal kalau kalah
function stopGame() {
    clearInterval(gameInterval);
    gameStart = false;
    instructionText.style.display = 'block'
    logo.style.display = 'block'
    start.style.display = 'block'
}