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
