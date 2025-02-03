/**
 * The main script file of the component for the flippable card.
 *
 * @author // TODO: Saskia Heinemannn <sh224wg@student.lnu.se>
 * @version 1.0.0
 */
const cardTemplate = document.createElement('template')
cardTemplate.innerHTML = `
<style>
:host(:focus) {
    outline: none;
}
.card {
    width: 80px;
    height: 80px;
    margin:5px;
    perspective: 1000px;
}

.focused {
    outline: none;
    box-shadow: 0 0 30px 10px  antiquewhite;
    border-radius: 10px;
}

.card-content {
  position: relative;
  width: 100%;
  height: 100%;
  text-align: center;
  transition: transform 0.6s;
  transform-style: preserve-3d;
  cursor: pointer;
}

.flip {
  transform: rotateY(180deg)
}

.inactive{
  pointer-events: none;
}


.card-front, .card-back {
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 10px;
    border: 2px solid black;
    background-size: cover;
    backface-visibility: hidden;

}

.card-front {
  background-color:rgb(35, 29, 29);
  transform: rotateY(180deg)

}

.card-back {
  background-color:rgb(167, 167, 159);
  background-image: url(./images/0.png);

}

slot {
  display: inline-block;
  width: 100%;
  height: 100%;
}

.hidden{
  opacity: 0;
  transition: opacity 0.5s ease-out;
}

</style>
<div class="card">
  <div class="card-content">
    <div class="card-front" part="front">
      <slot name="front"></slot>
    </div>
    <div class="card-back" part="back">
      <slot name="back"></slot>
    </div>
  </div>
</div>
  `

/**
 * FlipCard is a custome HTML element that represents a flippable card.
 * Extends the HTMLElement interface.
 *
 * @class
 */
class flipCard extends HTMLElement {
  /**
   * Constructs a new flipCard element.
   * This sets up the shadow DOM, adds event listeners, and initializes some properties.
   */
  constructor () {
    super()
    this.isActive = true
    this.isHidden = false
    this.attachShadow({ mode: 'open' }).appendChild(cardTemplate.content.cloneNode(true))
  }

  /**
   * Lifecycle method called when the element is connected to the DOM.
   * It sets up the initial state and event listeners for the card.
   * The card is initially not flipped up. When it's clicked, it will flip up or down depending on its current state.
   * The card is focusable, and when it's focused and the Enter or Space key is pressed, it will be clicked if it's active and not already flipped up.
   * When the card is focused, the 'focused' class is added to its content, and when it loses focus, the 'focused' class is removed.
   */
  connectedCallback () {
    this.cardContent = this.shadowRoot.querySelector('.card-content')
    this.isFlippedUp = false
    this.cardContent.addEventListener('click', () => {
      if (!this.isFlippedUp) {
        this.flipUp()
      } else {
        this.flipDown()
      }
    })
    this.setAttribute('tabindex', 0)
    this.addEventListener('keydown', (event) => {
      if ((event.key === 'Enter' || event.key === ' ') && this.isActive && !this.isFlippedUp) {
        this.cardContent.click()
      }
    })
    this.addEventListener('keydown', this.handleKeys)
    this.addEventListener('focus', () => this.cardContent.classList.add('focused'), true)
    this.addEventListener('blur', () => this.cardContent.classList.remove('focused'), true)
  }

  /**
   * Handles keyboard navigation for a grid of cards.
   * The method responds to the 'Enter', ' ', 'ArrowUp', 'ArrowDown', 'ArrowRight', and 'ArrowLeft' keys.
   * 'Enter' and ' ' flip the card.
   * The arrow keys move the focus to the card in the corresponding direction in the grid.
   *
   * @param {KeyboardEvent} event - The keyboard event.
   */
  handleKeys (event) {
    // All cards in the grid converted to array
    const cards = Array.from(this.parentNode.children)
    // index of current card in array.
    const index = cards.indexOf(this)
    // findIndex to find the index of the first card in the next row
    let nrColumns = cards.findIndex((card, i) => i > index && card.offsetTop !== this.offsetTop)
    if (nrColumns === -1) nrColumns = cards.length - index // if last row

    switch (event.key) {
      case 'ArrowUp': {
        const upCard = cards[index - nrColumns]
        if (upCard) upCard.focus()
        break
      }
      case 'ArrowDown': {
        const downCard = cards[index + nrColumns]
        if (downCard) downCard.focus()
        break
      }
      case 'ArrowRight': {
        const rightCard = cards[index + 1]
        if (rightCard) rightCard.focus()
        break
      }
      case 'ArrowLeft': {
        const leftCard = cards[index - 1]
        if (leftCard) leftCard.focus()
        break
      }
    }
  }

  /**
   * Returns a list of attributes to be observed for changes.
   * The 'front-image' and 'back-image' attributes are being observed.
   *
   * @returns {string[]} - The list of attributes to be observed.
   */
  static get observedAttributes () {
    return ['front-image']
  }

  /**
   * Called when one of the observed attributes has been changed.
   * Updates the background image of the front or back of the card, depending on which attribute was changed.
   *
   * @param {string} name - The name of the attribute that has changed.
   * @param {string} newValue - The new value of the attribute.
   */
  attributeChangedCallback (name, newValue) {
    if (name === 'front-image') {
      this.frontImage = newValue
    }
  }

  /**
   * Flips the card up.
   * If there are already two active cards, it deactivates them and doesn't flip this card.
   * If this card is already flipped up, or if it's hidden or deactivated, it doesn't flip.
   *
   * When the card is flipped up, it adds the 'flip' class to its content, updates the front image, sets the visible side to 'back',
   * dispatches a 'cardFlipped' event with this card as the detail, and disables pointer events.
   */
  flipUp () {
    // all active cards
    const activeCards = Array.from(document.querySelectorAll('flip-card')).filter(card => card.isActive)
    if (activeCards.length >= 2) {
      // deactivate cards
      activeCards.forEach(card => card.deactivate())
      return
    }
    // If the card is already flipped up or if it's hidden or deactivated, don't flip
    if (this.isFlippedUp || this.isHidden || !this.isActive) {
      return
    }
    this.isFlippedUp = true
    this.cardContent.classList.add('flip')

    const frontImage = this.getAttribute('front-image')
    const cardFront = this.shadowRoot.querySelector('.card-front')
    cardFront.style.backgroundImage = `url(${frontImage})`

    this.visibleSide = 'back'

    this.dispatchEvent(new CustomEvent('cardFlipped', { detail: this }))

    this.style.pointerEvents = 'none'
  }

  /**
   * Flips the card down.
   *
   * If the card is not flipped up, it doesn't do anything.
   *
   * When the card is flipped down, it removes the 'flip' class from its content.
   */
  flipDown () {
    if (!this.isFlippedUp) {
      return
    }
    this.isFlippedUp = false

    // Flip the card down
    this.cardContent.classList.remove('flip')
  }

  /**
   * Hides the card by setting its visibility to 'hidden'.
   * This method also sets the `isHidden` property to true.
   */
  hide () {
    this.isHidden = true
    this.cardContent.classList.add('hidden')
  }

  /**
   * Deactivates the card.
   *
   * It sets the 'isActive' property to false, removes the 'active' class and adds the 'inactive' class to the card.
   */
  deactivate () {
    this.isActive = false
    this.classList.remove('active')
    this.classList.add('inactive')
  }
}
customElements.define('flip-card', flipCard)
