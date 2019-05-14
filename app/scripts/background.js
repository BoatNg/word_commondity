import storage from 'chrome-storage-wrapper'
import { handleChromeRuntimeMessage } from './helpers/message'
import { getActiveTab } from './helpers/tabs'
import defaults from './config/defaults'
import lscache from 'lscache'
import translator from './translator'
import { trim } from 'lodash'
import app from './app'
import _ from 'lodash'

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

handleChromeRuntimeMessage({
  translate(message, sender, sendResponse) {
    // console.trace('background translate')
    // console.log('message', message)
    // console.log('sender', sender)
    storage.get('notifyTimeout').then(options => {
      // console.trace('storage')
      // console.log(options)
      translateText(message.text).then(result => {
        // console.trace('translateText')
        // console.log(result)
        if (message.from === 'page') {
          result.timeout = options.notifyTimeout
        } else {
          window.localStorage.setItem('current', message.text)
        }
        chrome.storage.sync.get(["user_info"], data => {
          result.user_info = {}
          let { user_info } = data;
          if (user_info && user_info.token) {
            let login_time = user_info.login_time;
            let now = new Date().getTime();
            if (now - login_time < 1000 * 60 * 60 * 24 * 7) {
              result.user_info = user_info
            }
          }
          sendResponse(result)
        })
      })
    })
  },

  selection(message, sender, sendResponse) {
    chrome.storage.sync.get(["option_config"], data => {
      let { option_config } = data;
      if (option_config) {

      } else {
        if (option_config.is_selection === undefined) {
          option_config.is_selection = true;
        }
      }
      if (option_config.is_selection) {
        window.localStorage.setItem('current', message.text)
        if (isWord(message.text)) {
          getActiveTab(tab => {
            chrome.tabs.sendMessage(sender.tab.id, {
              type: 'translate',
              text: message.text
            })
          })
        }
      }
    })

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
