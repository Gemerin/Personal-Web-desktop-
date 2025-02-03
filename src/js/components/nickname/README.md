# NameInput Web Component

The `NameInput` web component is a custom HTML element that extends `HTMLElement`. It represents an input field for a user's name.

## Features

- A form with a text input field and a submit button.
- The text input field is used for the user to enter their name.
- The submit button dispatches a custom 'enterChat' event with the user's name when clicked, if the name input field is not empty.
- If the name input field is empty when the submit button is clicked, an alert is shown and an error is logged to the console.

## Usage

To use this web component, include the following HTML in your page:

<name-input></name-input>

### Methods 

createForm() - Creates a form with a submit button.

### Properties 

- #nameInput - private property, represents an input field for a user's name.

#### Events 

- enterChat event fired when submit button is clicked

Author
Eva Heinemann sh224wg@student.lnu.se

Version
1.1.0
