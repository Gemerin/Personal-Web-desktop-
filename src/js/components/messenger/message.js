/**
 * Message chat web component module.
 *
 * @author // Saskia Heinemann <sh224wg@student.lnu.se>
 * @version 1.1.0
 */

import '../nickname/index.js'

const chatTemplate = document.createElement('template')
chatTemplate.innerHTML = `
<style>

#container{
    background-color:rgb(208, 214, 219);
    position: relative;
    height: 92%;
    width:440px;
    display:grid;
    margin: 3px;
    grid-template-rows: auto 1fr auto;
    border-radius: 10px;
    }

#postion{
    margin-top: 20px;
}
#messageContainer{
    display: flex;
    justify-content: space-between;
    width: 98%;
    grid-row: 3;
    margin: 5px;

}
#messageBox{
    display: none;
    width: 90%;
    height: 40px;
    border-radius:5px;
}
button{
    display: none;
    width: 15%;
}

#chatContainer{
    position: relative;
    height: 100%; /* Adjust as needed */
    width: 100%;
    flex-direction: column;
    overflow: auto;
    grid-row: 2;
    border-radius:2px;
}

#chatLog {
 justify-content: flex-start;
 text-align: flex-start;
 width:90%;
 white-space: pre-wrap;
 overflow-wrap: break-word;
 flex-grow: 1; 
 margin:2px;
 font-family:monospace, lucida-console;
}
</style>
<div id="container">
    <name-input id="position"></name-input>
    <div id="chatContainer">
        <div id="chatLog"></div>
    </div>
    <div id="messageContainer">
        <textarea id="messageBox" type="text" placeholder="Write Your Message Here..." maxlength="500" warp="hard"></textarea>
        <button id="sendButton">Send</button>
    </div>
</div>
`
/**
 * Message Chat is a custome HTML element that represents a message chat application.
 * Extends the HTMLElement interface.
 *
 * @class
 * @property {string[]} messages - An array of strings for the messages stores in the application (private property).
 */
class messageChat extends HTMLElement {
  #messages = []
  /**
   *Constructs a new instance of the message chat.
   * It initializes the shadow root, appends the chat template to it,
   * and initializes message application properties.
   */
  constructor () {
    super()
    const shadow = this.attachShadow({ mode: 'open' })
    shadow.appendChild(chatTemplate.content.cloneNode(true))
    this.userName = ''
    this.ws = null // initialize websocket
  }

  /**
   * Lifecycle method that is called when the element is inserted into the DOM.
   * It sets up event listeners, retrieves the username from local storage,
   * establishes a WebSocket connection, generates an encryption key, and sets up
   * handlers for incoming messages, errors, and connection closure.
   *
   * @async
   */
  async connectedCallback () {
    this.shadowRoot.querySelector('#messageBox').addEventListener('keyup', (event) => {
      if (event.key === 'Enter') {
        this.sendMessage(event.target.value)
        event.target.value = ''
      }
    })
    this.shadowRoot.querySelector('#sendButton').addEventListener('click', () => {
      const messageBox = this.shadowRoot.querySelector('#messageBox')
      this.sendMessage(messageBox.value)
      messageBox.value = ''
    })
    this.shadowRoot.querySelector('name-input').addEventListener('enterChat', (event) => {
      this.handleNameInput(event)
    })
    // retrieve username from local storage
    this.userName = localStorage.getItem('userName')
    if (this.userName) {
      // if username exists display messagebox
      this.shadowRoot.querySelector('name-input').style.display = 'none'

      this.shadowRoot.querySelector('#messageBox').style.display = 'block'
      this.shadowRoot.querySelector('button').style.display = 'block'
    } else {
      // if no username display name input
      this.shadowRoot.querySelector('name-input').style.display = 'block'
    }
    this.ws = new WebSocket('wss://courselab.lnu.se/message-app/socket')

    // Generate the key
    this.key = await window.crypto.subtle.generateKey(
      {
        name: 'AES-GCM',
        length: 256 // key bit length
      },
      true,
      ['encrypt', 'decrypt']
    )
    // create new typed Array of unsigned 8 bit integers can hold value 0 - 255
    this.iv = (new Uint8Array([233, 224, 154, 116, 46, 18, 67, 171, 69, 175, 172, 159]))

    // handle incoming messages
    this.ws.onmessage = this.handleMessage.bind(this)

    // handle errors
    this.ws.onerror = this.handleErrors.bind(this)

    // lost websocket connection
    this.ws.onclose = this.handleClose.bind(this)
  }

  /**
   * Handles the input of the user's name.
   * It saves the user's name both in the component's state and in local storage.
   * It then removes the name-input component from the DOM and displays the message box and send button.
   *
   * @param {Event} event - The event object, with the user's name in the `detail.name` property.
   */
  handleNameInput (event) {
    // Save user name
    this.userName = event.detail.name
    localStorage.setItem('userName', this.userName)
    // remove name-input component
    const nameInput = this.shadowRoot.querySelector('name-input')
    nameInput.parentNode.removeChild(nameInput)

    this.shadowRoot.querySelector('#messageBox').style.display = 'block'
    this.shadowRoot.querySelector('button').style.display = 'block'
  }

  /**
   * Sends a message over the WebSocket connection.
   * The message is encrypted using the AES-GCM algorithm before it is sent.
   * If the WebSocket connection is not open, the method does nothing.
   *
   * @async
   * @param {string} messageText - The text of the message to send.
   */
  async sendMessage (messageText) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      // Define encryption details
      const algorithm = {
        name: 'AES-GCM',
        iv: this.iv
      }

      // Convert messageText to ArrayBuffer with global class from encoding API to convert string into bytes
      const encoder = new TextEncoder()
      const data = encoder.encode(messageText)

      // Encrypt the message
      const encryptedData = await window.crypto.subtle.encrypt(algorithm, this.key, data)

      // Convert encryptedData to Base64 with btoa encoded string (media), from unicode values, from each element as a byte.
      const base64Ciphertext = btoa(String.fromCharCode(...new Uint8Array(encryptedData)))

      // create message
      const message = {
        type: 'message',
        username: this.userName,
        key: 'eDBE76deU7L0H9mEBgxUKVR0VCnq0XBd',
        data: base64Ciphertext,
        isEncrypted: true
      }
      // Send the message
      this.ws.send(JSON.stringify(message))
    }
  }

  /**
   * Handles incoming messages from the WebSocket connection.
   * If the message is of type 'heartbeat', it is ignored.
   * If the message is encrypted, it is decrypted using the AES-GCM algorithm.
   * The decrypted message or the original message (if not encrypted) is then added to the message array.
   *
   * @async
   * @param {Event} event - The event object, with the message data in the `data` property.
   */
  async handleMessage (event) {
    const data = JSON.parse(event.data)

    // ignore heartbeat
    if (data.type === 'heartbeat') {
      return
    }
    if (data.isEncrypted) {
      try {
        console.log(data.data)
        // convert base64 to ascii string then each character to unicode value and then converted into typed array.
        const encryptedData = Uint8Array.from(atob(data.data), c => c.charCodeAt(0))
        const algorithm = {
          name: 'AES-GCM',
          iv: this.iv
        }
        const decryptedData = await window.crypto.subtle.decrypt(algorithm, this.key, encryptedData)
        // convert to string
        const decoder = new TextDecoder()
        const decryptedText = decoder.decode(decryptedData)
        // add to message array
        this.addMessage(`${data.username}:${decryptedText}`)
      } catch (error) {
        console.error('Error during decryption:', error)
      }
    } else {
      this.addMessage(`${data.username}:${data.data}`)
    }
  }

  /**
   * Adds a message to the messages array and updates the display.
   * If there are more than 20 messages in the array, the oldest message is removed.
   *
   * @param {string} message - The message to add.
   */
  addMessage (message) {
    this.#messages.push(message)
    this.#messages = this.#messages.slice(-20)

    this.displayMessages()
  }

  /**
   * Clears the chat log and then displays each message in the messages array.
   * Each message is displayed as a new paragraph element in the chat log.
   */
  displayMessages () {
    const chatLog = this.shadowRoot.querySelector('#chatLog')
    chatLog.innerHTML = ''

    // Display each message
    for (const message of this.#messages) {
      const messageElement = document.createElement('p')
      messageElement.textContent = message
      chatLog.appendChild(messageElement)
    }
  }

  /**
   * Handles errors from the WebSocket connection.
   * It logs the error to the console and displays an alert to the user.
   *
   * @param {Error} error - The error object from the WebSocket connection.
   */
  handleErrors (error) {
    console.error('WebSocket error', error)
    alert('WebSocket error')
  }

  /**
   * Handles the closing of the WebSocket connection.
   * It logs the event to the console and displays an alert to the user.
   *
   * @param {Event} event - The event object from the WebSocket connection.
   */
  handleClose (event) {
    console.log('Websocket Connection Lost:', event)
    alert('Websocket Connection Lost')
  }

  /**
   * Cleans up when the element is disconnected from the DOM. If a WebSocket
   * connection exists, it removes the event handlers and closes the connection.
   */
  disconnectedCallback () {
    if (this.ws) {
      this.ws.onmessage = null
      this.ws.onerror = null
      this.ws.onclose = null
      this.ws.close()
    }
  }
}
customElements.define('message-chat', messageChat)
