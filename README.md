# ssr - slop score rating

a browser extension for chrome and firefox that measures the slop of the current website.

## what it shows

the extension shows the slop score rating and the amount of slop markers per group:

- the slop score rating: the ratio of slop markers to other words, multiplied by 1000
- dashes: – (en dash), — (em dash)
- quotes: „ “ ” ‘ ’ (double and single quotation marks)
- guillemets: « »
- bullets: • (bullet point)

all counts run on the full page text of the current tab.

the slop score rating is also shown as a badge on the toolbar button.

## design

the project is written so that both extensions stay as similar as possible. the chrome and firefox versions share as much code as possible, even though the two browsers have completely different extension formats.

## structure

```
.
├── shared/   # code shared between both browsers
├── chrome/   # chrome extension (manifest v3)
└── firefox/  # firefox extension (manifest v2)
```

## build

the build uses `make` and `zip`, no dependencies.

```
make            # build firefox and chrome
make firefox    # firefox only
make chrome     # chrome only
make clean      # remove build/
```

the build copies `shared/` plus the browser specific files into `build/<browser>/` and packs the result into `build/ssr-<version>-<browser>.xpi` (firefox) or `.zip` (chrome). the version comes from the browser manifest.

## install

### chrome

1. open `chrome://extensions`
2. enable developer mode
3. "load unpacked" and pick the `build/chrome/` folder

### firefox

the xpi from the build is unsigned, so you can only use it for temporary testing:

1. open `about:debugging#/runtime/this-firefox` 
2. "load temporary add-on" and pick the xpi (lasts until firefox is closed)