// common.js - shared data and functions
// loaded by the popup (before popup.js) and the background script

// rating to verdict/color scale,
// dark enough so the white badge text stays readable
function verdictFor(rating) {
  if (rating === 0) return { word: 'Very unlikely', color: '#16a34a' }
  if (rating < 5) return { word: 'Unlikely', color: '#65a30d' }
  if (rating < 10) return { word: 'Neutral', color: '#ca8a04' }
  if (rating < 15) return { word: 'Likely', color: '#d97706' }
  if (rating <= 50) return { word: 'Very likely', color: '#ea580c' }
  return { word: 'WTF Likely', color: '#dc2626' }
}
