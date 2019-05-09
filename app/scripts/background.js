import storage from 'chrome-storage-wrapper'
import { dispatchMessage } from './helpers/message'
import { getActiveTab } from './helpers/tabs'
import defaults from './config/defaults'
import lscache from 'lscache'
import translator from './translator'
import { trim } from 'lodash'
import app from './app'

const PAT_WORD = /^[a-z]+('|'s)?$/i

function translateText(text) {
  const sourceText = trim(text)
  const cacheKey = `text:v2:${sourceText}`
  let result = lscache.get(cacheKey)
  result = JSON.parse(result)
  return result ? Promise.resolve(result) : translator.translate(sourceText)
}

function isWord(text) {
  return PAT_WORD.test(text)
}

dispatchMessage({
  translate(message, sender, sendResponse) {
    console.trace('background translate')
    console.log('message', message)
    console.log('sender', sender)
    storage.get('notifyTimeout').then(options => {
      console.trace('storage')
      console.log(options)
      translateText(message.text).then(result => {
        console.trace('translateText')
        console.log(result)
        if (message.from === 'page') {
          result.timeout = options.notifyTimeout
        } else {
          window.localStorage.setItem('current', message.text)
        }

        sendResponse(result)
      })
    })
  },

  selection(message, sender, sendResponse) {
    window.localStorage.setItem('current', message.text)
    console.trace('selection')
    if (isWord(message.text)) {
      getActiveTab(tab => {
        if (app.isSiteEnabled(tab.hostname)) {
          chrome.tabs.sendMessage(sender.tab.id, {
            type: 'translate',
            text: message.text
          })
        }
      })
    }
  },

  current(message, sender, sendResponse) {
    sendResponse(window.localStorage.getItem('current'))
  },

  linkInspect(message, sender, sendResponse) {
    if (message.enabled) {
      chrome.browserAction.setIcon({ path: 'images/icon.png' })
    } else {
      chrome.browserAction.setIcon({ path: 'images/icon.png' })
    }
  }
})

// Register command for quick link inspect switch
chrome.commands.onCommand.addListener(command => {
  if (command === 'toggle-link-inspect') {
    getActiveTab(tab => chrome.tabs.sendMessage(tab.id, { type: 'toggleLink' }))
  }
})

app.prepareOptions()
