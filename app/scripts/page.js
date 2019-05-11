import $ from 'jquery'
import Vue from 'vue'
import { handleChromeRuntimeMessage } from './helpers/message'
import { toggleLinkInspectMode } from './helpers/utils'
import ResultList from './components/ResultList.vue'

let app = null;

function getApp () {
  if ($('#cst-list').length == 0) {
    $('<div id="cst-list"></div>').appendTo('body')
    app = new Vue({
      el: '#cst-list',
      render: h => h(ResultList),
    });
  }

  return app.$children[0]
}

function translate (message, sender, sendResponse) {
  console.log('page translate')
  getApp().translate(message.text)
}

function toggleLink (message, sender, sendResponse) {
  // toggleLinkInspectMode()
}

handleChromeRuntimeMessage({ translate, toggleLink })
