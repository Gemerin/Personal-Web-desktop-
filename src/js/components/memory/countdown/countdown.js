/**
 * Timer web component module.
 *
 * @author // Eva Heinemann <sh224wg@student.lnu.se>
 * @version 1.1.0
 */
const timerTemplate = document.createElement('template')
timerTemplate.innerHTML = `
  <style>
    
    #timer{
      font-size: 15px;
      color: white;
      margin: 0;
      padding:0;
      display: inline-block;
    }
  </style>
  <div id="timer"></div>  
  `

/**
 * `Counter` is a custom HTML element that extends HTMLElement.
 * It represents a timer component.
 */
class Counter extends HTMLElement {
  /**
   * #timer is a private property that holds the timer instance.
   *
   * @type {number|null}
   */
  #timer = null

  /**
   * #count is a private property that holds the duration of the countdown in seconds.
   *
   * @type {number}
   */
  #count = 0

  /**
   * Constructs a new instance of the Counter component.
   * It attaches a shadow root, clones and appends the content of the timerTemplate to the shadow root,
   * and initializes the #count property to 0 seconds and the #timer property to null.
   */
  constructor () {
    super()
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.appendChild(timerTemplate.content.cloneNode(true))
  }

  /**
   * Lifecycle callback that is invoked when the custom element is connected to the DOM.
   * When the element is connected, it starts the timer.
   */
  connectedCallback () {
    this.startTimer()
  }

  /**
   * Gets the current count value.
   *
   * @returns {number} The current count.
   */
  get count () {
    return this.#count
  }

  /**
   * Starts the timer.
   *
   * It sets up an interval that calls the `updateTimer` method every 1000 milliseconds (1 second).
   */
  startTimer () {
    if (this.#timer) {
      clearInterval(this.#timer)
    }
    this.#timer = setInterval(() => this.updateTimer(), 1000)
  }

  /**
   * Updates the countdown timer.
   * It increments the `#count` property and updates the text content of the '#timer' element in the shadow DOM to reflect the new count.
   */
  updateTimer () {
    this.#count++
    this.shadowRoot.querySelector('#timer').textContent = this.#count
  }

  /**
   * Stops the timer.
   *
   * It clears the interval set by `startTimer`, effectively stopping the timer.
   */
  stopTimer () {
    clearInterval(this.#timer)
  }

  /**
   * Lifecycle callback that is invoked when the custom element is disconnected from the DOM.
   * When the element is disconnected, it stops the timer.
   */
  disconnectedCallback () {
    this.stopTimer()
  }
}
customElements.define('counter-timer', Counter)
