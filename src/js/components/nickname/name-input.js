/**
 * The nick-name web component module.
 *
 * @author // Saskia Heinemann <sh224wg@student.lnu.se>
 * @version 1.1.0
 */
const template = document.createElement('template')
template.innerHTML = `
  <style>
    :host {
      display: block;
    } 
    input, button {
      display: block;
      justify-content: center;
      margin-left: auto;
      margin-right: auto;
      margin-top: 10px;
    }
  </style>
  <div>
    <form>
      <input type="text" placeholder="Enter your name..." class="nameInput">
      <button type="submit" class="submitButton">Submit</button>
    </form>
  </div>
`

/**
 *`NameInput` is a custom HTML element that extends HTMLElement.
 *
 * @class
 */
class NameInput extends HTMLElement {
  /**
   * @private
   * @type {HTMLInputElement}
   * Represents an input field for a user's name.
   */
  #nameInput

  /**
   * Constructs a new instance of the NameInput component.
   * It attaches a shadow root, clones and appends the content of the template,
   * calls the createForm method to create the form, and queries for the name input field.
   */
  constructor () {
    super()
    const shadow = this.attachShadow({ mode: 'open' })
    shadow.appendChild(template.content.cloneNode(true))
    this.createForm()
    this.#nameInput = this.shadowRoot.querySelector('.nameInput')
  }

  /**
   * Creates a form with a submit button.
   * If the name input field is not empty, it dispatches a custom 'submitAndStart' event with the player's name.
   */
  createForm () {
    const form = this.shadowRoot.querySelector('form')

    // Create a submit button
    const submitButton = this.shadowRoot.querySelector('.submitButton')

    // Attach a click event listener to the button
    submitButton.addEventListener('click', (event) => {
      event.preventDefault()

      const playerName = this.#nameInput.value.trim()
      if (playerName !== '') {
        // Trigger the custom event when the button is clicked
        this.dispatchEvent(new CustomEvent('enterChat', {
          detail: {
            name: this.#nameInput.value.trim()
          },
          bubbles: true
        }))
      } else {
        alert('Name field cannot be empty')
        console.error('Name field cannot be empty')
      }
    })
    form.append(submitButton)
  }

  /**
   * Lifecycle method that is called when the custom element is removed from the DOM.
   */
  disconnectedCallback () {
    const submitButton = this.shadowRoot.querySelector('.submitButton')
    submitButton.removeEventListener('click', this.handleButtonClick)
  }
}
customElements.define('name-input', NameInput)
