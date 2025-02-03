# Message Chat

Message Chat is a custom HTML element that provides a simple chat interface. It uses WebSocket for real-time communication and the Web Cryptography API for message encryption.

## Features 

- Real-time communication using WebSocket
- Message encryption and decryption using the Web Cryptography API
- Base64 encoding and decoding using the WindowBase64 API
- Automatic handling of WebSocket connection errors and closures
- Limiting the number of displayed messages to the last 20

## Usage

To use this web component, include the following tag in your HTML:

<message-chat></message-chat>

### Method

sendMessage(messageText): Sends a message over the WebSocket connection. The message is encrypted before it is sent.

handleMessage(event): - Handles incoming messages from the WebSocket connection. If the message is encrypted, it is decrypted before it is added to the message array.

addMessage(message): - Adds a message to the messages array and updates the display.

displayMessages(): - Clears the chat log and then displays each message in the messages array.

handleErrors(error): - Handles errors from the WebSocket connection.

handleClose(event): - Handles the closing of the WebSocket connection.

disconnectedCallback(): - Cleans up when the element is disconnected from the DOM.

### Properties 

- this.ws: The Websocket connection

- this.key: The encryption key.

- this.iv: The initialization vector for the encryption.

- this.#messages: The array of messages.

#### Events

- onmessage: Triggered when a message is received from the WebSocket connection.

- onerror: Triggered when an error occurs in the WebSocket connection.

- onclose: Triggered when the WebSocket connection is closed.

Author
Saskia Heinemann sh224wg@student.lnu.se

Version
1.1.0