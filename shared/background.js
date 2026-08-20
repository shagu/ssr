// background.js - keeps the toolbar badge in sync with the active tab

const api = typeof browser !== 'undefined' ? browser : chrome
const action = api.action || api.browserAction

const BADGE_COLOR = '#1c2128'

function setBadge(stats) {
  action.setBadgeText({ text: stats ? String(stats.rating) : '' })
  action.setBadgeBackgroundColor({ color: BADGE_COLOR })
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

async function updateBadge() {
  const tab = await queryActiveTab()
  const stats = tab ? await requestStats(tab.id) : null
  setBadge(stats)
}

api.tabs.onActivated.addListener(updateBadge)
api.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (changeInfo.status === 'complete') updateBadge()
})
updateBadge()
