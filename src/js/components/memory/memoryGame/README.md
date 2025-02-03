# Memory Game 

## Description
The memory game component is built with JavaScript. The goal of the game is to match all pairs of cards in the least amount of time and with the fewest number of attempts.'

## Features

- Multiple difficulty levels
- Timer to track how long it takes to finish the game
- Counter to track the number of match attempts

## Usage

To use this web component, include the following tag in your HTML:

<memory-game></memory-game>

## Methods

collectMatchedPair() - The `collectMatchedPair` method increments the count of matched pairs.

randomize() - The `randomize` method shuffles the elements of the provided array in place.

startGame() - The `startGame` method starts a new game with the specified size.

createGrid() - The `createGrid` method sets up the game grid in the game container.

addCards() - The `addCards` method adds flip cards to the game container.

isMatch() - The `isMatch` method checks if the two flipped cards match.

handleFlip() - The `handleFlip` method handles the flipping of a card.

isGameOver() -  The `isGameOver` method checks if the game is over.

gameOver() - The `gameOver` method handles the end of the game.

restartGame() - The `restartGame` method handles the restarting of the game.

### Properties 

- #gameSize -The size of the gamegrid ( private property).

- imageUrl - An array of relative URLS for the images used in the game.

#### Events

The memory game component dispatches several custom events that you can listen for:

- `matchFound`: This event is dispatched when a match is found. The `detail` property of the event contains the matched cards.

 - `noMatch`: This event is dispatched when a pair of cards do not match. The detail property of the event contains the unmatched cards.

 - `gameOver`: This event is dispatched when the game is over. The detail property of the event contains the game object and the final time count.


Author
Saskia Heinemann sh224wg@student.lnu.se

Version
1.1.0