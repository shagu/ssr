// popup.js - asks the active tab for the dash stats and renders them

const api = typeof browser !== 'undefined' ? browser : chrome

function queryActiveTab() {
  return new Promise((resolve) => {
    api.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      resolve(tabs && tabs.length > 0 ? tabs[0] : null)
    })
  })
}

function requestCount(tabId) {
  return new Promise((resolve) => {
    let settled = false
    const done = (value) => {
      if (settled) return
      settled = true
      resolve(value && value.dashes !== undefined ? value : null)
    }
    const p = api.tabs.sendMessage(tabId, { type: 'ssr/count' }, (response) => {
      if (api.runtime.lastError) return done(null)
      done(response)
    })
    // firefox also returns a promise here, swallow its rejection
    if (p && typeof p.then === 'function') p.then(done, () => done(null))
  })
}

function show(state) {
  for (const name of ['loading', 'error', 'result']) {
    document.getElementById('state-' + name).hidden = name !== state
  }
}

async function main() {
  const tab = await queryActiveTab()
  const stats = tab ? await requestCount(tab.id) : null
  if (!stats) {
    show('error')
    return
  }
  document.getElementById('dashes').textContent = String(stats.dashes)
  document.getElementById('ratio').textContent = String(stats.ratio)
  show('result')
}

main()
