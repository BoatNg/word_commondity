import { handleChromeRuntimeMessage } from './helpers/message'
import { getSelection } from './helpers/selection'
import { toggleLinkInspectMode } from './helpers/utils'

function selectionHandler(evt) {
  console.trace('selectionHandler')
  // toggleLinkInspectMode(false)

  const text = getSelection()

  if (text) {
    chrome.runtime.sendMessage({ type: 'selection', text: text })
  }
}

document.addEventListener('mouseup', selectionHandler)
