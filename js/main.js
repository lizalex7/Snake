
// **Elements
const grid = document.querySelector('.grid')
const startBtn = document.getElementById('startBtn')
const pointsScored = document.getElementById('points')
const cells = []

// **Grid
const width = 15
const cellCount = width * width

// **Variables
let gameActive
let gameInterval
let intervalSpeed = 800
let score = 0
const caterpillar = [16, 17, 18]
let currentDirection = 1
let applePosition = 0
const restrictCells = []


// This function creates the grid which is visible on page load
function createGrid() {
  for (let i = 0; i < cellCount; i++) {
    const cell = document.createElement('div')
    // cell.innerText = i
    // cell.id = i
    grid.append(cell)
    cell.style.width = `${100 / width}%`
    cell.style.height = `${100 / width}%`

    if (i < width || i >= cellCount - width || i % width === 0 || i % width === width - 1)
      cell.classList.add('edge-cell')

    cells.push(cell)
  }
}

// **Executions
// START GAME - Start button clicked which adds the caterpillar at the start position and adds the apple in a random position on the board
function startGame(evt) {
  if (!gameActive) {
    console.log('GAME STARTED')
    gameActive = true
    addApple()
    addAllCaterpillar()
    gameInterval = setInterval(moveCaterpillar, (intervalSpeed))
  }
}

function moveCaterpillar(evt) {
  removeAllCaterpillar()
  checkForApple()
  caterpillar.shift()
  const caterpillarHead = caterpillar[caterpillar.length - 1]
  caterpillar.push(caterpillarHead + (currentDirection))
  addAllCaterpillar()
  handleCollision()
}

// -> If caterpillar finds apple, apple is removed, points score increases by 100, new apple appears in random cell
function checkForApple() {
  if (cells[caterpillar[caterpillar.length - 1]].classList.contains('apple')) {
    removeApple()
    addApple() 
    score += 100
    incCaterpillar()
  }
  pointsScored.innerText = score
}

// Adding the caterpillar to the grid
function addCaterpillar(position) {
  cells[position].classList.add('caterpillar')
}

// Create full caterpillar
function addAllCaterpillar(caterpillarArray) {
  caterpillar.forEach(addCaterpillar)
}

// Adding the apple to a random position on the grid
function addApple() {
  // Adding restriced cells to an array
  cells.forEach((cell, index) => {
    if (cell.classList.contains('edge-cell', 'caterpillar')) {
      restrictCells.push(index)
    }
  })
  do {
    applePosition = Math.floor(Math.random() * cells.length)
  } while (restrictCells.includes(applePosition))

  cells[applePosition].classList.add('apple')
}

// Remove the caterpillar from the previous cell
function removeCaterpillar(position) {
  cells[position].classList.remove('caterpillar')
}

// Remove the caterpillar from all cells
function removeAllCaterpillar(caterpillarArray) {
  caterpillar.forEach(removeCaterpillar)
}

// Remove the apple from the previous cell
function removeApple() {
  cells[applePosition].classList.remove('apple')
}

// This function will move the caterpillar in the grid.
function directCaterpillar(evt) {
  const key = evt.code

  if (key === 'ArrowRight') {
    currentDirection = 1
  } else if (key === 'ArrowLeft') {
    currentDirection = -1
  } else if (key === 'ArrowUp') {
    currentDirection = -width
  } else if (key === 'ArrowDown') {
    currentDirection = width
  }
}

// This function increases the speed and size of the caterpillar each time an apple is eaten
function incCaterpillar() {
  clearInterval(gameInterval)
  gameInterval = setInterval(moveCaterpillar, (intervalSpeed = intervalSpeed * 0.8))

  caterpillar.unshift(caterpillar[0] - currentDirection)
}

// This function handles collisions with the walls and the caterpillar itself.
function handleCollision(collision) {
  const caterpillarHead = caterpillar[caterpillar.length - 1]
  if (
    // Collision with right wall
    (caterpillarHead % width === width - 1 && currentDirection === 1) ||
    // Collision with left wall
    (caterpillarHead % width === 0 && currentDirection === -1) ||
    // Collision with top wall
    (caterpillarHead - width < 0 && currentDirection === -width) ||
    // Collision with bottom wall
    (caterpillarHead + width >= width * width && currentDirection === width)
  ){
    endGame()
  } // Collision with itself
  for (let i = 0; i < caterpillar.length - 1; i++) {
    if (caterpillar[i] === caterpillarHead) {
      endGame()
    } 
  }
}

// This function outlines the process once a collision occurs -> the interval clears, alert appears and caterpillar and apple removed
function endGame() {
  clearInterval(gameInterval)
  alert('GAME OVER')
  removeAllCaterpillar()
  removeApple()
}

// **Events
// Event listener on start button
startBtn.addEventListener('click', startGame)

// Keypress event - on key press update caterpillar position
document.addEventListener('keydown', directCaterpillar)

// **On page load
// Grid visible on page load
createGrid()


