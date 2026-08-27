// popup.js - asks the active tab for the slop stats and renders them

const api = typeof browser !== 'undefined' ? browser : chrome

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

function show(state) {
  document.getElementById('state-error').hidden = state !== 'error'
  document.getElementById('state-result').hidden = state !== 'result'
}

function renderGroups(groups) {
  const box = document.getElementById('groups')
  for (const group of groups) {
    const row = document.createElement('div')
    row.className = group.count === 0 ? 'row zero' : 'row'
    const label = document.createElement('span')
    label.className = 'label'
    label.textContent = group.name + ' (' + group.chars + ')'
    const value = document.createElement('span')
    value.className = 'value'
    value.textContent = String(group.count)
    row.appendChild(label)
    row.appendChild(value)
    box.appendChild(row)
  }
}

async function main() {
  const tab = await queryActiveTab()
  const stats = tab ? await requestStats(tab.id) : null
  if (!stats) {
    show('error')
    return
  }
  const verdict = verdictFor(stats.rating)
  const verdictEl = document.getElementById('verdict')
  verdictEl.textContent = verdict.word
  verdictEl.style.color = verdict.color
  document.getElementById('rating').textContent = String(stats.rating)
  renderGroups(stats.groups)
  show('result')
}

main()
