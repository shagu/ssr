# ssr - slop score rating

a browser extension for chrome and firefox that counts the "—" (em dash) of the current website.

## what it shows

the extension displays two numbers:

- the amount of "—" on the page
- the ratio of "—" to other words, multiplied by 1000

## design

the project is written so that both extensions stay as similar as possible. the chrome and firefox versions share as much code as possible, even though the two browsers have completely different extension formats.

## structure

```
.
├── shared/   # code shared between both browsers
├── chrome/   # chrome extension (manifest v3)
└── firefox/  # firefox extension (manifest v2)
```