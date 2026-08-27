// background.js - keeps the toolbar badge in sync with the active tab

const api = typeof browser !== 'undefined' ? browser : chrome
const action = api.action || api.browserAction

// chrome service workers are single-file, load the shared common.js
// (already loaded by the firefox manifest and the popup)
if (typeof importScripts === 'function') importScripts('common.js')

const BADGE_TEXT_COLOR = '#ffffff'

function setBadge(stats) {
  const rating = stats ? stats.rating : 0
  action.setBadgeText({ text: stats ? String(rating) : '' })
  action.setBadgeBackgroundColor({ color: verdictFor(rating).color })
  // white text, not supported by firefox, guard the call
  if (action.setBadgeTextColor) action.setBadgeTextColor({ color: BADGE_TEXT_COLOR })
}

function queryActiveTab() {
  return new Promise((resolve) => {
    api.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      resolve(tabs && tabs.length > 0 ? tabs[0] : null)
    })
  })
}

function requestStats(tabId) {
  return new Promise((resolve) => {
    let settled = false
    const done = (value) => {
      if (settled) return
      settled = true
      resolve(value && value.markers !== undefined ? value : null)
    }
    const p = api.tabs.sendMessage(tabId, { type: 'ssr/count' }, (response) => {
      if (api.runtime.lastError) return done(null)
      done(response)
    })
    // firefox also returns a promise here, swallow its rejection
    if (p && typeof p.then === 'function') p.then(done, () => done(null))
  })
}

// overlapping updates (e.g. fast tab switching) must not overwrite each other
let updateSeq = 0

async function updateBadge() {
  const seq = ++updateSeq
  const tab = await queryActiveTab()
  if (seq !== updateSeq) return
  const stats = tab ? await requestStats(tab.id) : null
  if (seq !== updateSeq) return
  setBadge(stats)
}

api.tabs.onActivated.addListener(updateBadge)
api.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (changeInfo.status === 'complete') updateBadge()
})
// stats pushed by the content script on dynamic pages
// (discord, infinite scroll), only update for the active tab
api.runtime.onMessage.addListener((message, sender) => {
  if (!message || message.type !== 'ssr/stats' || !sender.tab) return
  queryActiveTab().then((tab) => {
    if (tab && tab.id === sender.tab.id) setBadge(message.stats)
  })
})
updateBadge()
