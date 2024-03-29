import _ from 'lodash'
import storage from 'chrome-storage-wrapper'
import migrateOptions from './migrate-options'

const defaults = {
  notifyTimeout: 8,
  siteRules: {
    '*': true
  },
}

let options = _.clone(defaults);

function isSiteEnabled(site) {
  const { siteRules } = options;
  if (site in siteRules) {
    return siteRules[site]
  } else {
    return siteRules['*']
  }
}

function setOptions(newOptions) {
  storage.set(newOptions)
  options = newOptions
}

function getOptions() {
  if (!options) {
    return Promise.resolve(options)
  } else {
    return storage.getAll()
  }
}

function prepareOptions() {
  storage.getAll()
    .then(options => migrateOptions(options))
    .then(options => _.defaults(options, defaults))
    .then(options => setOptions(options))
  chrome.storage.onChanged.addListener(() => {
    options = getOptions()
  })
}

export default {
  isSiteEnabled,
  prepareOptions,
}
