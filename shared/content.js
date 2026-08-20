// content.js - runs on every page, answers count requests from the popup

const api = typeof browser !== 'undefined' ? browser : chrome

function pageText() {
  if (document.body && typeof document.body.innerText === 'string') {
    return document.body.innerText
  }
  return (document.documentElement && document.documentElement.textContent) || ''
}

api.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (!message || message.type !== 'ssr/count') return
  sendResponse(computeStats(pageText()))
})

// pushes fresh stats to the background when the page changes,
// covers dynamic content like discord or infinite scroll
const PUSH_DELAY = 1000
let pushTimer = 0

function pushStats() {
  if (pushTimer) return
  pushTimer = setTimeout(() => {
    pushTimer = 0
    api.runtime.sendMessage(
      { type: 'ssr/stats', stats: computeStats(pageText()) },
      () => void api.runtime.lastError
    )
  }, PUSH_DELAY)
}

new MutationObserver(pushStats).observe(document.documentElement, {
  subtree: true,
  childList: true,
  characterData: true
})
pushStats()
