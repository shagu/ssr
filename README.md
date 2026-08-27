# Slop Score Rating

The web is full of pages that read like they were written by a machine.
ssr tells you that in one number: it scores every page you visit for
"slop", the typographic fingerprint of AI-generated text.

The rating is always in your line of sight. ssr shows it as a badge on
the toolbar button, updates it while you browse, and breaks it down by
marker in the popup. Open any article, blog post, or product page and
you get a feel for how much of the text in front of you was probably
typed by an algorithm, before you read a single word.

Everything runs locally in your browser. There is no account, no
network, and no data ever leaves your machine.

## When to use it

- Judging at a glance whether a project is completely vibe-coded
- Reading an article and wondering whether it is human or machine written
- Wanting a quick signal for how generic the text is
- Checking how much your own published writing looks like slop
- Spotting template-speak in product pages, docs, and forum threads

## How it works

ssr reads the text of the current tab and counts the characters that
machine-written text loves to use:

- Dashes: – (en dash), — (em dash)
- Quotes: „ “ ” ‘ ’ (double and single quotation marks)
- Guillemets: « » (French-style quotation marks)
- Bullets: • (bullet point)

The slop score rating is the number of these markers per 1000 words.
Clean prose scores 0. A page where every sentence is studded with
dashes and curly quotes scores in the hundreds.

The badge updates on its own: when you switch tabs, when a page
finishes loading, and when the page changes while you read it, like
infinite scroll or live feeds. Open the popup to see the rating and
the count of every marker group.

The rating is a heuristic, not a proof. It measures how much a page
looks like slop, not who wrote it. Treat it as a first impression,
not a verdict.

## Design

The code is written so that both extensions stay as similar as possible. 
The Chrome and Firefox versions share as much code as possible.

## Structure

```
.
├── shared/   # code shared between both browsers
├── chrome/   # chrome extension (manifest v3)
└── firefox/  # firefox extension (manifest v2)
```

## Build

The build uses `make` and `zip`, no dependencies.

```
make            # build firefox and chrome
make firefox    # firefox only
make chrome     # chrome only
make clean      # remove build/
```

The build copies `shared/` plus the browser specific files into `build/<browser>/` and packs the result into `build/ssr-<version>-<browser>.xpi` (firefox) or `.zip` (chrome). The version comes from the browser manifest.

## Install

### Chrome

1. Open `chrome://extensions`
2. Enable developer mode
3. "Load unpacked" and pick the `build/chrome/` folder

### Firefox

The xpi from the build is unsigned, so you can only use it for temporary testing:

1. Open `about:debugging#/runtime/this-firefox`
2. "Load temporary add-on" and pick the xpi (lasts until Firefox is closed)