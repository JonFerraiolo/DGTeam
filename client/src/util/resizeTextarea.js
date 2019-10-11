
/**
 * Utility to resize a textarea element to fit its contents 
 * @param {Element} textarea
 * @param {string} maxHeight  css length value
 */
let resizeTextarea = ((textarea, maxHeight) => {
  // textarea auto-resize trick
  textarea.style.maxHeight = 'auto'
  textarea.style.height = 'auto'
  textarea.style.height = (textarea.scrollHeight+5)+'px'
  textarea.style.maxHeight = maxHeight
})

export default resizeTextarea
