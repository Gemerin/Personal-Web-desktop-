import '../Card/index.js'
import '../memoryGame/memoryGame.js'

window.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('flip-card').forEach(card => {
    card.addEventListener('click', () => {
      console.log('Inner HTML', card.innerHTML)
      console.log('Visible side :', card.visibleSide)
    })
  })
})
