# Counter Timer Web Component

This project is a custom HTML element that extends HTMLElement. It represents a timer component.

## Features

- Timer that increments every second.
- The timer starts automatically when the custom element is connected to the DOM.
- The timer stops when the custom element is disconnected from the DOM.

## Usage

To use this web component, include the following tag in your HTML:

<counter-timer></counter-timer>

### Properties
count: Read-only property that gets the current count value.

### Methods
startTimer(): Starts the timer. Sets up an interval that calls the updateTimer method every 1000 milliseconds (1 second).
stopTimer(): Stops the timer. Clears the interval set by startTimer.

Author
Eva Heinemann sh224wg@student.lnu.se

Version
1.1.0
