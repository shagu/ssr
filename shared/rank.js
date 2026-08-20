// rank.js - shared slop ranking logic, currently counts em dashes
// loaded by the content script (before content.js)

// counts em dashes and other words in the given text
// dashes: total em dashes in the text
// words: tokens that contain at least one non dash character
// ratio: dashes per 1000 other words, rounded to an integer
function computeStats(text) {
  const dashes = (text.match(/\u2014/g) || []).length
  let words = 0
  for (const token of text.split(/\s+/)) {
    if (token.replace(/\u2014/g, '').length > 0) words++
  }
  const ratio = words > 0 ? Math.round((dashes / words) * 1000) : 0
  return { dashes, words, ratio }
}
