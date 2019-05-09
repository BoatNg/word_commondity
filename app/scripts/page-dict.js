import wait from './helpers/wait'
import $ from 'jquery'
const trim = $.trim
function getTextNode(el) {
  return $(el)
    .contents()
    .filter(
      function () {
        if (this.nodeType === 3) {
          if ($.trim($(this).text())) {
            return true
          }
        }
        return false

      });
}
function fetchResult() {
  let translation = []
  $.each(
    $('#phrsListTab .trans-container li'),
    function (ind, item) {
      translation.push({
        value: item.innerText
      })
    }
  )

  let pronounce = []
  let pronDom = getTextNode('#phrsListTab .pronounce')
  $.each(
    $('#phrsListTab .pronounce span'),
    function (ind, item) {
      pronounce.push({
        type: trim($(pronDom[ind]).text()),
        value: item.innerText
      })
    }
  )

  let word_group = []
  let wordGroupDom = getTextNode('#wordGroup>p')
  $.each(
    $('#wordGroup>p>span>a'),
    function (ind, item) {
      word_group.push({
        zh: trim($(wordGroupDom[ind]).text()),
        en: item.innerText
      })
    }
  )

  let synonyms = []
  $.each(
    $('#synonyms>ul>li'),
    function (ind, item) {
      let dom = $(item)
      let zh = dom.text()
      let enDom = dom.next().find('a')
      let en = []
      $.each(enDom, function (ind1, item1) {

        en.push($(item1).text())
      })
      synonyms.push({
        zh,
        en
      })
    }
  )

  let cognateDom = $('#relWordTab')
    .contents()
    .filter(
      function () {
        if ($.trim($(this).text())) {
          return true
        } else {
          return false
        }
      });
  let cognate = {
    value: []
  }
  let cognatePOS = ''
  $.each(cognateDom, function (ind, item) {

    if (ind === 0) {
      cognate.root = trim($(item).find('a').text())
    } else {
      if (item.nodeType === 3) {
        cognatePOS = trim($(item).text())
      } else {
        let obj = {
          pos: cognatePOS,
          zh: trim(getTextNode(item).text()),
          en: trim($(item).find('a').text())
        }
        cognate.value.push(obj)
      }
    }
  })


  let example_sentence = []
  $.each($('#bilingual li'), function (ind, item) {
    example_sentence.push({
      en: trim($(item).find('p:nth-child(1)').text()),
      zh: trim($(item).find('p:nth-child(2)').text())
    })
  })

  let data = {
    value: $('#phrsListTab .keyword').text(),
    translation, // 翻译
    pronounce, // 发音
    pos: $('#phrsListTab .additional').text(), // 词态
    word_group, // 词组
    synonyms, // 同义词
    cognate,  // 同根词
    example_sentence,
  }
  console.log(JSON.stringify(data))
  return data
  // const elemTrans = document.querySelector('.trans-container')
  // if (elemTrans && !elemTrans.getAttribute('id')) {
  //   const result = {
  //     status: 'success',
  //     translation: trim(elemTrans.innerHTML)
  //   }

  //   const elemPhon = document.querySelector('.baav')
  //   if (elemPhon) {
  //     result.phonetic = trim(elemPhon.innerText)
  //   }

  //   return result
  // }
}

function onMessage(event) {
  const { data } = event
  console.log('[dict] iframe received message:', JSON.stringify(data))
  if (data.type === 'fetch-result') {
    wait(fetchResult).then(result => {
      event.source.postMessage({
        type: 'result',
        url: data.url,
        result: result
      }, '*')
    })
  }
}

window.addEventListener('message', onMessage, false)
