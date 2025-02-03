/**
 * Memory Game web component module.
 *
 * @author // Eva Heinemann <sh224wg@student.lnu.se>
 * @version 1.1.0
 */
import '../Card/index.js'
import '../countdown/index.js'

const gameTemplate = document.createElement('template')
gameTemplate.innerHTML = `
  <style>
    #container{
      background-color: black;
      width: 450px;
      min-height: 90%;
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
    }
    #button-container {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 10px;
    }

    #attempts{
      font-size: 20px;
      color: gray;
      text-align: center;
      padding:5%;
    }

    .hidden {
      display: none;
    }

    .game-size-button {
      width: 25%;
      padding: 15px;
      margin:10px;
      background-color:rgb(190, 180, 180);
      border-radius: 20px;
      text-align: center;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 0.9rem;
      font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
    }

   
   
  </style>
  <div id="container">
    <div id="game-container">
      <div id="attempts">
          </div>
        </div>
   <div id="button-container">
     <button class="game-size-button" data-size="small">EASY</button>
     <button class="game-size-button" data-size="medium">MEDIUM</button>
      <button class="game-size-button" data-size="large">HARD</button>
</div>
</div>
  
  `
/**
 * MemoryGame is a custome HTML element that represents a memory game.
 * Extends the HTMLElement interface.
 *
 * @class
 * @property {number} gamesize - The size of the gamegrid ( private property).
 * @property {string[]} imageUrl - An array of relative URLS for the images used in the game.
 */
class MemoryGame extends HTMLElement {
  #gameSize

  imageUrl = [
    './images/1.png',
    './images/2.png',
    './images/3.png',
    './images/4.png',
    './images/5.png',
    './images/6.png',
    './images/7.png',
    './images/8.png'
  ]

  /**
   * Constructs a new instance of the MemoryGame.
   * It initializes the shadow root, appends the game template to it,
   * and initializes game-related properties.
   *
   */
  constructor () {
    super()
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.appendChild(gameTemplate.content.cloneNode(true))
    this.flippedCards = []
    this.cards = []
    this.waitingForFlipBack = false
    this.matchAttempts = 0
  }

  /**
   * The `connectedCallback` lifecycle method is called when this element is added to the DOM.
   * It adds click event listeners to all '.game-size-button' elements.
   * When a button is clicked, it starts a new game with the size specified by the button's 'data-size' attribute.
   * It also sets up event listeners for 'cardFlipped' and 'gameOver' events.
   */
  connectedCallback () {
    this.shadowRoot.querySelectorAll('.game-size-button').forEach(button => {
      button.addEventListener('click', (event) => {
        const size = event.target.dataset.size
        this.startGame(size)

        if (!this.cardFlippedListener) {
          this.addEventListener('cardFlipped', (event) => {
            this.controlFlip(event.detail)
          })
          this.cardFlippedListener = true
        }

        this.addEventListener('gameOver', this.restartGame.bind(this))
      })
    })
  }

  /**
   * The `collectMatchedPair` method increments the count of matched pairs.
   * It's typically called when a pair of cards has been successfully matched in the game.
   *
   */
  collectMatchedPair () {
    this.matchedPairs++
  }

  /**
   * The `boardSize` getter returns the current game size.
   * It's a read-only property that provides access to the private `#gameSize` field.
   *
   * @type {number}
   */
  get boardSize () {
    return this.#gameSize
  }

  /**
   * The `boardSize` setter sets the size of the game board.
   * It accepts a string ('small', 'medium', or 'large') and updates the `#gameSize` private field and the class of the game container accordingly.
   * If an invalid value is provided, it throws an error.
   *
   * @param {string} value - The new size of the game board.
   * @throws {Error} Will throw an error if the provided value is not 'small', 'medium', or 'large'.
   */
  set boardSize (value) {
    const gameContainer = this.shadowRoot.querySelector('#game-container')
    switch (value) {
      case 'small':
        this.#gameSize = { width: 2, height: 2 }
        gameContainer.classList.add('small')
        gameContainer.classList.remove('medium', 'large')
        break
      case 'medium':
        this.#gameSize = { width: 4, height: 2 }
        gameContainer.classList.add('medium')
        gameContainer.classList.remove('small', 'large')
        break
      case 'large':
        this.#gameSize = { width: 4, height: 4 }
        gameContainer.classList.add('large')
        gameContainer.classList.remove('small', 'medium')
        break
      default:
        throw new Error('Invalid game size')
    }
  }

  /**
   * The `randomize` method shuffles the elements of the provided array in place.
   * It uses the `Array.prototype.sort` method with a comparator function that returns a random number, effectively randomizing the order of the elements.
   *
   * @param {Array} array - The array to be randomized.
   */
  randomize (array) {
    array.sort(() => Math.random() - 0.5)
  }

  /**
   * The `startGame` method starts a new game with the specified size.
   * It clears the game board, removes the button container, randomizes the back images of the cards, and loads the images.
   * If all images load successfully, it creates the grid and adds the cards.
   * It also starts the game timer.
   * If any image fails to load, it logs an error.
   *
   * @async
   * @param {string} size - The size of the game board ('small', 'medium', or 'large').
   * @throws {Error} Will throw an error if any image fails to load.
   */
  async startGame (size) {
    this.boardSize = size

    // Clear the #attempts element
    const attemptsElement = this.shadowRoot.querySelector('#attempts')
    if (attemptsElement) {
      attemptsElement.textContent = ''
    }
    this.matchedPairs = 0

    // Clear the container
    const gameContainer = this.shadowRoot.querySelector('#game-container')
    while (gameContainer.firstChild) {
      gameContainer.firstChild.remove()
    }
    // Remove the buttonContainer
    const buttonContainer = this.shadowRoot.querySelector('#button-container')
    if (buttonContainer) {
      buttonContainer.remove()
    }

    const backImages = Array.from(this.shadowRoot.querySelectorAll('.card-back')).map(card => card.style.backgroundImage)
    this.randomize(backImages)

    this.shadowRoot.querySelectorAll('.card-back').forEach(card => {
      const backImage = card.getAttribute('back-image')
      card.style.backgroundImage = `url(${backImage})`
    })
    // Promise for each image to load
    const imagePromises = this.imageUrl.map(image => {
      return new Promise((resolve, reject) => {
        const img = new Image()
        img.src = image
        img.onload = resolve
        img.onerror = reject
      })
    })

    try {
      await Promise.all(imagePromises)
      this.createGrid()
      this.addCards()
    } catch (error) {
      console.error('One or more images failed to load:', error)
    }
    this.gameTimer = document.createElement('counter-timer')
    const container = this.shadowRoot.querySelector('#container')
    container.prepend(this.gameTimer)
    this.gameTimer.startTimer()
  }

  /**
   * The `createGrid` method sets up the game grid in the game container.
   * It sets the display of the game container to 'grid' and configures the grid's columns and rows according to the board size.
   * Each column and row takes up an equal fraction of the available space.
   */
  createGrid () {
    const gameContainer = this.shadowRoot.querySelector('#game-container')

    gameContainer.style.display = 'grid'
    gameContainer.style.gridTemplateColumns = `repeat(${this.boardSize.width}, 1fr)`
    gameContainer.style.gridTemplateRows = `repeat(${this.boardSize.height}, 1fr)`
  }

  /**
   * The `addCards` method adds flip cards to the game container.
   * It first selects a unique set of images randomly from the available images, then duplicates and shuffles them to create the card images.
   * It then creates a flip card for each image, sets the front image of the card, and adds an event listener to handle the card flip.
   * The created cards are also added to the `cards` array.
   */
  addCards () {
    const gameContainer = this.shadowRoot.querySelector('#game-container')
    // add flip cards
    const selectedImages = []
    while (selectedImages.length < this.boardSize.width * this.boardSize.height / 2) {
      const randomIndex = Math.floor(Math.random() * this.imageUrl.length)
      if (!selectedImages.includes(this.imageUrl[randomIndex])) {
        selectedImages.push(this.imageUrl[randomIndex])
      }
    }
    // Duplicate and shuffle images
    const cardImages = [...selectedImages, ...selectedImages]
    this.randomize(cardImages)

    for (let i = 0; i < this.boardSize.width * this.boardSize.height; i++) {
      const card = document.createElement('flip-card')
      gameContainer.appendChild(card)
      card.setAttribute('front-image', cardImages[i])

      card.addEventListener('click', () => {
        this.handleFlip(card)
      })

      this.cards.push(card)
    }
  }

  /**
   * The `isMatch` method checks if the two flipped cards match.
   * It compares the 'front-image' attributes of the two cards.
   * If the cards do not match, it flips them back down and clears the `flippedCards` array.
   * It also sets `waitingForFlipBack` to false.
   * It returns a boolean indicating whether the cards match.
   *
   * @returns {boolean} - Returns true if the two flipped cards match, false otherwise.
   */
  isMatch () {
    const [card1, card2] = this.flippedCards
    const isMatch = card1.getAttribute('front-image') === card2.getAttribute('front-image')

    if (!isMatch) {
      // Get all the cards
      card1.flipDown()
      card2.flipDown()

      this.flippedCards = []
      this.waitingForFlipBack = false
    }
    return isMatch
  }

  /**
   * The `handleFlip` method handles the flipping of a card.
   * If the game is waiting for a flip back or if two cards are already flipped, it returns without doing anything.
   * Otherwise, it flips the card up, adds it to the `flippedCards` array, and checks for a match if two cards have been flipped.
   * If the cards match, it hides them, dispatches a 'matchFound' event, and checks if the game is over.
   * If the cards do not match, it flips them back down and dispatches a 'noMatch' event.
   * After checking for a match, it resets the `flippedCards` array and re-enables the click event on all cards.
   *
   * @param {object} card - The card to flip.
   */
  handleFlip (card) {
    if (this.waitingForFlipBack || this.flippedCards.length >= 2) {
      return
    }
    // Flip the card and add it to the flippedCards array
    card.flipUp()
    this.flippedCards.push(card)

    // If two cards have been flipped, check for a match
    if (this.flippedCards.length === 2) {
      this.matchAttempts++
      // Disable click event on all cards
      this.cards.forEach(card => {
        card.style.pointerEvents = 'none'
      })

      setTimeout(() => {
        const isMatch = this.isMatch()

        if (isMatch) {
          this.flippedCards.forEach(card => card.hide())
          this.dispatchEvent(new CustomEvent('matchFound', { detail: this.flippedCards }))

          this.matchedPairs++
          if (this.isGameOver()) {
            setTimeout(() => {
              this.gameOver()
            }, 1000)
          }
        } else {
          this.flippedCards.forEach(card => card.flipDown())
          this.dispatchEvent(new CustomEvent('noMatch', { detail: this.flippedCards }))
        }

        // Reset the flippedCards array
        this.flippedCards = []

        // Re-enable click event on all cards
        this.cards.forEach(card => {
          card.style.pointerEvents = ''
        })
      }, 500)
    }
  }

  /**
   * The `isGameOver` method checks if the game is over.
   * The game is considered over when the number of matched pairs equals the total number of pairs on the board.
   * The total number of pairs is calculated as the product of the board's height and width divided by 2.
   *
   * @returns {boolean} - Returns true if the game is over, false otherwise.
   */
  isGameOver () {
    const totalPairs = (this.boardSize.height * this.boardSize.width) / 2
    return this.matchedPairs === totalPairs
  }

  /**
   * The `gameOver` method handles the end of the game.
   * It stops the game timer, removes the timer and the cards from the DOM, and dispatches a 'gameOver' event.
   * The 'gameOver' event includes details about the game and the final time count.
   *
   */
  gameOver () {
    this.gameTimer.stopTimer()
    const count = this.gameTimer.count
    const timer = this.shadowRoot.querySelector('counter-timer')
    if (timer) {
      timer.remove()
    }
    // Get all the cards
    const cards = Array.from(this.shadowRoot.querySelectorAll('flip-card'))

    // Remove the grid and the cards
    const grid = this.querySelector('.grid')
    if (grid) {
      grid.remove()
    }
    cards.forEach(card => card.remove())

    this.dispatchEvent(new CustomEvent('gameOver', { detail: { game: this, time: count } }))
  }

  /**
   * The `restartGame` method handles the restarting of the game.
   * It first finds or creates the attempts element and updates its text content with the number of match attempts.
   * It then creates a time element and appends it to the attempts element.
   * It also finds or creates a button container and appends it to the game container.
   * It then defines the data for the game size buttons, creates the buttons, adds an event listener to each button to start the game when clicked, and appends the buttons to the button container.
   * Finally, it resets the number of match attempts.
   *
   * @param {object} event - The event object, which includes the time detail.
   */
  restartGame (event) {
    const container = this.shadowRoot.querySelector('#container')

    let attemptsElements = this.shadowRoot.querySelector('#attempts')
    if (!attemptsElements) {
      attemptsElements = document.createElement('div')
      attemptsElements.id = 'attempts'
      container.appendChild(attemptsElements)
    }
    const time = event.detail.time
    attemptsElements.textContent = `Match Attempts: ${this.matchAttempts}.`
    const timeElement = document.createElement('div')
    timeElement.textContent = `Time: ${time} seconds.`
    attemptsElements.appendChild(timeElement)

    let buttonContainer = this.shadowRoot.querySelector('#button-container')
    if (!buttonContainer) {
      buttonContainer = document.createElement('div')
      buttonContainer.id = 'button-container'
    }
    container.appendChild(buttonContainer)

    // Define the button sizes and labels
    const buttonsData = [
      { size: 'small', label: 'EASY' },
      { size: 'medium', label: 'MEDIUM' },
      { size: 'large', label: 'HARD' }
    ]
    // Create and add the buttons
    buttonsData.forEach(data => {
      const button = document.createElement('button')
      button.classList.add('game-size-button')
      button.dataset.size = data.size
      button.textContent = data.label

      button.addEventListener('click', () => {
        this.startGame(button.dataset.size)
      })
      buttonContainer.appendChild(button)
      this.matchAttempts = 0
    })
  }
}
customElements.define('memory-game', MemoryGame)
