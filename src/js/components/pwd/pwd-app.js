/**
 * Application Window component module.
 *
 * @author // Saskia Heinemann <sh224wg@student.lnu.se>
 * @version 1.1.0
 */

import '../memory/Card/index.js'

const appWindowTemplate = document.createElement('template')
appWindowTemplate.innerHTML = `
   <style>
        .window {
          position: absolute;
          width: 30vw;
          height: 70vh;
          background-color:gray;
          border: 1px solid #000;   
          display: none;
          box-sizing: border-box;
          border-radius:10px;
          padding:5px;
        }
        .window-header {
          height: 30px; 
          background-color: gray; 
          display: flex;
          align-items: center;
          justify-content: flex-end;
          padding: 0 10px;
          box-sizing: border-box;
          position: sticky;
          top: 0;
          border-radius: 10px;
        }
       .close-button {
          position: absolute;
          top: 0;
          right: 0;
          margin:3px;
          padding: 7px;
          cursor: pointer;
          border-radius:70%;
          background-color: red;
          width:5px;
          height:5px;
        }

        .slot-container{
            display:flex;
            flex-direction:column;
            height:100%;
            align-items:stretch;
        }
        .slot{
            display:flex;
            height:100%;
            width: 100%;
        }

      </style>

    <div id="window" class="window">
        <div class="window-header">
            <button class="close-button"></button>
        </div>
        <div class="slot-container">
            <slot class="slot"></slot>
        </div>
      </div>
    </div>

`
/**
 * App Window is a custome HTML element that represents an  application window.
 * Extends the HTMLElement interface.
 *
 * @class
 */
class AppWindow extends HTMLElement {
  /**
   * Creates an instance of `AppWindow`.
   * Attaches a shadow root to the element, appends the `appWindowTemplate` to the shadow root,
   * initializes an array to store windows, and sets the highest z-index to 0.
   */
  constructor () {
    super()
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.appendChild(appWindowTemplate.content.cloneNode(true))
    // array to store windows
    this.windows = []
    this.highestZIndex = 0
  }

  /**
   * Called when the element is connected to the DOM.
   * It sets up event listeners for each '.dock-item' element. When a '.dock-item' is clicked
   * or the 'Enter' key is pressed while it's focused, it loads the corresponding app and opens a new window for it.
   */
  connectedCallback () {
    this.window = this.shadowRoot.querySelector('#window')

    document.querySelectorAll('.dock-item').forEach((item, index) => {
      item.setAttribute('tabindex', index + 1)
      item.addEventListener('click', async () => {
        const appName = await this.loadApp(index)
        if (appName) {
          this.openWindow(appName)
        }
      })
      item.addEventListener('keydown', async (event) => {
        if (event.key === 'Enter') {
          const appName = await this.loadApp(index)
          if (appName) {
            this.openWindow(appName)
          }
        }
      })
    })
  }

  /**
   * Asynchronously loads an app based on the provided index.
   * The app is loaded using dynamic import, which returns a promise that resolves when the app has been loaded.
   * The name of the loaded app is returned.
   *
   * @param {number} index - The index of the app to load.
   * The index corresponds to the following apps: 0 - 'memory-game', 1 - 'message-chat', 2 - 'color-change'.
   * @returns {Promise<string>} A promise that resolves with the name of the loaded app.
   */
  async loadApp (index) {
    let appName
    switch (index) {
      case 0: {
        appName = 'memory-game'
        await import('../memory/memoryGame/index.js')
        break
      }
      case 1: {
        appName = 'message-chat'
        await import('../messenger/index.js')
        break
      }
      case 2: {
        appName = 'color-change'
        await import('../custom/index.js')
        break
      }
    }
    return appName
  }

  /**
   * Opens a new window for the specified app.
   * It creates an instance of the app, clones the window template, and attaches the app to the window.
   * It also sets up an event listener to handle window close events.
   * The window is then displayed and added to the list of windows.
   * Finally, it sets the focus to the new window, positions it, and makes it draggable.
   *
   * @param {string} appName - The name of the app to open a window for.
   * This should match the custom element name of the app.
   */
  openWindow (appName) {
    const appElement = document.createElement(appName)

    // clone the window template
    const windowElement = appWindowTemplate.content.cloneNode(true).querySelector('#window')

    const closeButton = windowElement.querySelector('.close-button')
    /**
     * Defines an event listener function that closes the window when invoked.
     * This function is stored in the close button and added as an event listener for the 'click' event.
     */
    const handleClose = () => {
      this.closeWindow(windowElement)
    }
    // store event listener in button and add
    closeButton.handleClose = handleClose
    closeButton.addEventListener('click', handleClose)

    const slot = windowElement.querySelector('slot')
    slot.appendChild(appElement)

    this.shadowRoot.appendChild(windowElement)
    windowElement.style.display = 'block'
    // add window to array
    this.windows.push(windowElement)

    this.window = windowElement // assign current window

    this.windowFocus(windowElement)

    this.positionWindow()
    this.dragWindow(windowElement)
  }

  /**
   * Positions the window in the DOM based on the number of existing windows.
   *
   */
  positionWindow () {
    const existingWindows = this.windows.length

    if (existingWindows !== 0) {
      this.window.style.left = `${existingWindows * 50}px`
      this.window.style.top = `${existingWindows * 50}px`
    } else {
      this.window.style.left = '20px'
      this.window.style.top = '20px'
    }
  }

  /**
   *Focuses the specified window element by setting its `z-index` to the highest available value.
   *
   * @param {HTMLElement} windowElement The HTML element representing the window to focus.
   */
  focusWindow (windowElement) {
    this.highestZIndex++
    windowElement.style.zIndex = this.highestZIndex
  }

  /**
   * Attaches a click handler to the specified window element to automatically focus the window when clicked.
   *
   * @param {HTMLElement} windowElement The HTML element representing the window to focus on click.
   */
  windowFocus (windowElement) {
    /**
     * The click handler for the window element. If the event target is contained within the window element,
     * the window is focused.
     *
     * @param {Event} event The click event object.
     */
    windowElement.clickHandler = (event) => {
      if (windowElement.contains(event.target)) {
        this.focusWindow(windowElement)
      }
    }
    windowElement.addEventListener('click', windowElement.clickHandler)
  }

  /**
   *Enables dragging of the specified window element by capturing mouse events and updating the window's position accordingly.
   *
   * @param {HTMLElement} windowElement The HTML element representing the window to drag.
   */
  dragWindow (windowElement) {
    let dragStartX, dragStartY // find position of mouse
    let windowStartX, windowStartY // position of window element
    let dragging = false

    const header = windowElement.querySelector('.window-header')

    header.addEventListener('mousedown', (event) => {
    // initate event to move window and find position of mouse
    // returns the number of pixels that the upper left corner of the current element is offset to the left within the HTMLElement.offsetParent node
      dragging = true
      dragStartX = event.clientX
      dragStartY = event.clientY
      windowStartX = windowElement.offsetLeft
      windowStartY = windowElement.offsetTop
    })

    document.addEventListener('mousemove', (event) => {
    // event listner on document to move window
      if (dragging) {
        const dx = event.clientX - dragStartX
        const dy = event.clientY - dragStartY
        windowElement.style.left = `${windowStartX + dx}px`
        windowElement.style.top = `${windowStartY + dy}px`
      }
    })

    document.addEventListener('mouseup', () => {
      dragging = false
    })
  }

  /**
   * Closes the specified window element and removes it from the DOM, along with its event listeners and the associated click handler.
   *
   * @param {HTMLElement} windowElement The HTML element representing the window to close.
   */
  closeWindow (windowElement) {
    const closeButton = windowElement.querySelector('.close-button')
    closeButton.removeEventListener('click', closeButton.handleClose)
    windowElement.removeEventListener('click', windowElement.clickHandler)

    windowElement.remove()
    // find the index of the window in array
    const index = this.windows.indexOf(windowElement)
    if (index > -1) {
      this.windows.splice(index, 1)
    }
    // check remaning windows in DOM
    if (this.windows.length > 0) {
      // if remaining windows set window to last in array
      this.window = this.windows[this.windows.length - 1]
    } else {
      // if no windows
      this.window = null
    }
  }
}

customElements.define('app-window', AppWindow)
