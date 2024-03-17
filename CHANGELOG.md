# Changelog

## v1.3.1

### BREAKING CHANGE

- `*.dat` is no longer stored directly in this repository, these large files (about 100MB) were removed through large-scale rebase.

### Fix Bugs

- Unable to submit to Edge: "error: The uploaded package consists of a compressed file." (Closed #21)

## v1.3.0

### Features

- Optimize popup menu, such as color, aspect ratio, a11y, font, animation, tooltip, color-picker, etc.
- Add sponsor button and share card to popup.
- More user-friendly shortcut keys.
- Add Github Discussions tip to options page.

### Fix Bugs

- Causes the browser to become unresponsive on pages containing a large number of kanji. (Closed #16)

## v1.2.0

### BREAKING CHANGE

- Migrate from Vue to React.

### Features

- Fully optimize the UI.
- Support N5 kanji filter.
- Support diverse display modes (always/never/hover gap/hover no-gap).
- Support SelectMode.Parentheses in Chrome/Edge, which can automatically add brackets to the copied furigana text.
- Support more shortcut keys. (See [this](https://github.com/aiktb/FuriganaMaker/blob/main/package.json))

### Fix Bugs

- Corrected the semantics of "On-off extension" to "On-off Auto Mode".

## v1.1.0

### Features

- User-defined rule editor completely controlled by the GUI.

### Fix Bugs

- Invalid JSON format anyway. (Closed #10)
- Browser shortcuts don't work. (Closed #11)

## v1.0.0

### Features

- Many common Japanese websites are supported by default.
- Local Japanese kanji parsing engine (no network required).
- Add furigana to any regions on the page.
- Freely modify the font size and color of furigana.
- Optionally show furigana only on hover state.
- Configurable default pages and regions for adding furigana.
