# Changelog

## v2.0.1

### Fix Bugs

- Web page oversize warnings appear too often.
- Action active flag is displayed on pages without Japanese text.

## v2.0.0

### Features

- Automatically adds furigana to Japanese sites (requires the source site to be correctly labeled with the language).
- Add changelog to the Options page.
- Adjust the options page UI to a left side navigation, right side content layout.

### Fix Bugs

- Shortcut keys missing i18n.
- Theme toggle buttons don't work on the first click.

## v1.6.1

### Fix Bugs

- x.com has no valid rules.

## v1.6.0

### Features

- Support i18n(en, ja, zh_CN, zh_TW, ko).
- UI icon optimization.

## v1.5.1

### Fix Bugs

- Twitter.com to x.com migration leads to breaking extension.

## v1.5.0

## Features

- Open the external welcome page on the first installation.

## v1.4.0

### Features

- Supports N4 levels of kanji filters. (Closed [#20](https://github.com/aiktb/FuriganaMaker/issues/20))
- Enable active flag for the icon of the page containing custom rules. (Closed [#48](https://github.com/aiktb/FuriganaMaker/issues/48))

## v1.3.3

### Performance Improvements

- Reduce FOUC(Flash of unstyled content) caused by network-loaded icons. (Closed [#42](https://github.com/aiktb/FuriganaMaker/issues/42))

## v1.3.2

### Fix Bugs

- The `ColorPicker` component does not represent the HSV/HSL color space correctly. (Closed [#19](https://github.com/aiktb/FuriganaMaker/issues/19))

## v1.3.1

### BREAKING CHANGE

- `*.dat` is no longer stored directly in this repository, these large files (about 100MB) were removed through large-scale rebase.

### Fix Bugs

- Unable to submit to Edge: "error: The uploaded package consists of a compressed file." (Closed [#21](https://github.com/aiktb/FuriganaMaker/issues/21))

## v1.3.0

### Features

- Optimize popup menu, such as color, aspect ratio, a11y, font, animation, tooltip, color-picker, etc.
- Add sponsor button and share card to popup.
- More user-friendly shortcut keys.
- Add Github Discussions tip to options page.

### Fix Bugs

- Causes the browser to become unresponsive on pages containing a large number of kanji. (Closed [#16](https://github.com/aiktb/FuriganaMaker/issues/16))

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

- Invalid JSON format anyway. (Closed [#10](https://github.com/aiktb/FuriganaMaker/issues/10))
- Browser shortcuts don't work. (Closed [#11](https://github.com/aiktb/FuriganaMaker/issues/11))

## v1.0.0

### Features

- Many common Japanese websites are supported by default.
- Local Japanese kanji parsing engine (no network required).
- Add furigana to any regions on the page.
- Freely modify the font size and color of furigana.
- Optionally show furigana only on hover state.
- Configurable default pages and regions for adding furigana.
