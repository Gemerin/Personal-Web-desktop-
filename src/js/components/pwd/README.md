# Personal Web Desktop

AppWindow is a custom HTML element that represents an application window. It's a part of a larger project that includes multiple applications.

## Features 

- Each window can be opened, focused, dragged around, and closed.
- The window positions itself based on the number of existing windows.
- The window can be focused by clicking on it.
- The window can be dragged around the screen by clicking and dragging the header.
- The window can be closed by clicking the close button.

## Usage

To use this web component, include the following HTML in your page:

<app-window></app-window>

### Method

loadApp(index): - Asynchronously loads an app based on the provided index.

openWindow(appName): - Opens a new window for the specified app.

positionWindow(): - Positions the window in the DOM based on the number of existing windows.

focusWindow(windowElement): - Focuses the specified window element by setting its z-index to the highest available value.

windowFocus(windowElement): - Attaches a click handler to the specified window element to automatically focus the window when clicked.

dragWindow(windowElement): - Enables dragging of the specified window element by capturing mouse events and updating the window's position accordingly.

closeWindow(windowElement): - Closes the specified window element and removes it from the DOM, along with its event listeners and the associated click handler.

### Properties 

- this.windows: An array that stores the windows. It's initialized as an empty array in the constructor.

- this.highestZIndex: A number that keeps track of the highest z-index value among the windows. It's initialized as 0 in the constructor.

Author
Saskia Heinemann sh224wg@student.lnu.se

Version
1.1.0