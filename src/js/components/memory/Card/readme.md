## Flip Card
This is a custom HTML element that creates a flippable card. The card can be flipped by clicking on it or by using the 'Enter' or 'Space' keys. The card can also be navigated using the arrow keys.

## Usage
To use this element, include the flip-card tag in your HTML. You can specify the front and back images of the card using the front-image and back-image attributes.

<flip-card front-image="front.jpg" back-image="back.jpg"></flip-card>

### Methods
flipUp(): Flips the card, updates front image and sets visible side to back.

flipDown(): Flips the card down.

hide(): Hides the card by setting its visibility to 'hidden'.

deactivate(): Deactivates the card, preventing it from being flipped.

#### Properties
isActive: A boolean indicating whether the card is active.
isHidden: A boolean indicating whether the card is hidden.
visibleSide: A string indicating which side of the card is currently visible ('front' or 'back').

##### Events
keydown: Handles keyboard navigation for a grid of cards. The method responds to the 'Enter', ' ', 'ArrowUp', 'ArrowDown', 'ArrowRight', and 'ArrowLeft' keys. 'Enter' and ' ' flip the card. The arrow keys move the focus to the card in the corresponding direction in the grid.

Author
Saskia Heinemannn sh224wg@student.lnu.se

Version
1.0.0