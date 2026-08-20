# makefile - assembles the firefox and chrome extensions
# copies shared/ + <browser>/ into build/<browser>/
# and packs the result into build/ssr-<version>-<browser>.<xpi|zip>

FX_VERSION := $(shell sed -n 's/.*"version": *"\([^"]*\)".*/\1/p' firefox/manifest.json)
CR_VERSION := $(shell sed -n 's/.*"version": *"\([^"]*\)".*/\1/p' chrome/manifest.json)

.PHONY: all firefox chrome clean

all: firefox chrome

firefox:
	rm -rf build/firefox
	mkdir -p build/firefox
	cp -r shared/. build/firefox/
	cp -r firefox/. build/firefox/
	rm -f build/ssr-$(FX_VERSION)-firefox.xpi
	cd build/firefox && zip -X -r ../ssr-$(FX_VERSION)-firefox.xpi *

chrome:
	rm -rf build/chrome
	mkdir -p build/chrome
	cp -r shared/. build/chrome/
	cp -r chrome/. build/chrome/
	rm -f build/ssr-$(CR_VERSION)-chrome.zip
	cd build/chrome && zip -X -r ../ssr-$(CR_VERSION)-chrome.zip *

clean:
	rm -rf build
