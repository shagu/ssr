// rank.js - shared slop ranking logic
// counts slop markers (dashes and fancy quotes) grouped by character type
// loaded by the content script (before content.js)

// marker groups, the name and the characters are shown in the popup
const MARKER_GROUPS = [
  { name: 'Dashes', chars: '\u2013, \u2014', regex: /[\u2013\u2014]/g },
  { name: 'Quotes', chars: '\u201e, \u201c, \u201d, \u2018, \u2019', regex: /[\u201e\u201c\u201d\u2018\u2019]/g },
  { name: 'Guillemets', chars: '\u00ab, \u00bb', regex: /[\u00ab\u00bb]/g },
  { name: 'Bullets', chars: '\u2022', regex: /[\u2022]/g }
]

// all slop marker characters, used to strip them from words
const SLOP_CHARS = /[\u2013\u2014\u201e\u201c\u201d\u2018\u2019\u00ab\u00bb\u2022]/g

// computes the slop stats of the given text,
// the rating is the number of markers per 1000 other words
function computeStats(text) {
  const groups = MARKER_GROUPS.map((group) => {
    return { name: group.name, chars: group.chars, count: (text.match(group.regex) || []).length }
  })
  const markers = groups.reduce((sum, group) => sum + group.count, 0)
  let words = 0
  for (const token of text.split(/\s+/)) {
    if (token.replace(SLOP_CHARS, '').length > 0) words++
  }
  const rating = words > 0 ? Math.round((markers / words) * 1000) : 0
  return { markers, rating, groups }
}
