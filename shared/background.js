// background.js - keeps the toolbar badge in sync with the active tab

const api = typeof browser !== 'undefined' ? browser : chrome
const action = api.action || api.browserAction

// badge colors, dark enough so the white badge text stays readable (wcag aa)
const BADGE_COLOR_LOW = '#1c2128'
const BADGE_COLOR_HIGH = '#d40000'
const BADGE_TEXT_COLOR = '#ffffff'

// up to 5 dark gray, above 5 dark red
function badgeColor(rating) {
  return rating > 5 ? BADGE_COLOR_HIGH : BADGE_COLOR_LOW
}

function setBadge(stats) {
  const rating = stats ? stats.rating : 0
  action.setBadgeText({ text: stats ? String(rating) : '' })
  action.setBadgeBackgroundColor({ color: badgeColor(rating) })
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
