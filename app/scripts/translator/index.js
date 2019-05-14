import _ from 'lodash'
import lscache from 'lscache'
import Dict from './dict'
import Fanyi from './fanyi'
import { words } from 'lodash'
// import axios from 'axios'
import $ from 'jquery'
const PAT_WORD = /^([a-z]+-?)+$/i
const RESULT_FAILURE = {
  translation: '未找到释义',
  status: 'failure'
}

function isWord(text) {
  return text.match(PAT_WORD)
}

function smartText(text) {
  return isWord(text) ? words(text).join(' ') : text
}

function cacheResult(text, result) {
  const key = `text:v2:${_.trim(text)}`
  lscache.set(key, JSON.stringify(result), 60 * 24 * 7)
  return result
}

function translate(text) {
  console.trace('translate')
  const sourceText = smartText(text)

  if (!sourceText) {
    Promise.resolve(RESULT_FAILURE)
  } else if (isWord(sourceText)) {
    return Dict.translate(sourceText)
      .then((result) => {
        return $.post(`${REMOTE_HOST}/api/v1/word`, result).then((data) => {
          if (data.code === 200 || data.code === 201) {
            result.word_id = data.data.word_id
            return cacheResult(text, result)
          } else {
            return RESULT_FAILURE
          }
        }).catch(err=> {
          return RESULT_FAILURE
        })
      })
      .catch(() => RESULT_FAILURE)
  } else {
    return Fanyi.translate(sourceText).catch(() => RESULT_FAILURE)
  }
}

export default { translate }
