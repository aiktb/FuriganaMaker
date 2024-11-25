# Changelog

## [2.2.0](https://github.com/aiktb/FuriganaMaker/compare/v2.1.6...v2.2.0) (2024-11-25)


### Features

* add translation ([#297](https://github.com/aiktb/FuriganaMaker/issues/297)) ([c2df927](https://github.com/aiktb/FuriganaMaker/commit/c2df92787a5e08b40fa26399cc504bf7a77d72e0))
* allow reset config to initial state ([#296](https://github.com/aiktb/FuriganaMaker/issues/296)) ([bca1c73](https://github.com/aiktb/FuriganaMaker/commit/bca1c736b78543b78a53a044cc8b4fcc83ce9b67))
* remove redundant custom rules and add rules reported by users ([#295](https://github.com/aiktb/FuriganaMaker/issues/295)) ([37a4e62](https://github.com/aiktb/FuriganaMaker/commit/37a4e627bfef0b5d36510e16f87b71124a030930))
* unify and beautify the options page style ([#294](https://github.com/aiktb/FuriganaMaker/issues/294)) ([1afb2dc](https://github.com/aiktb/FuriganaMaker/commit/1afb2dc74caa36ea8f0da0fcb49c3221f35c06a5))


### Bug Fixes

* `property registered` error will be reported if repeatedly navigate to welcome page ([#290](https://github.com/aiktb/FuriganaMaker/issues/290)) ([ceeb03f](https://github.com/aiktb/FuriganaMaker/commit/ceeb03ffbeff578f6565a52169c80b79556e658f))
* **style:** buttons are not aligned ([#300](https://github.com/aiktb/FuriganaMaker/issues/300)) ([47ecd70](https://github.com/aiktb/FuriganaMaker/commit/47ecd7043d03a20ca5a3fa7cc7e6efcefb7b406d))
* **website:** card lacks reflective effect ([#291](https://github.com/aiktb/FuriganaMaker/issues/291)) ([a41307b](https://github.com/aiktb/FuriganaMaker/commit/a41307bf61b51a0ea9e70c62de67ab7f277498a5))
* **website:** card opacity is 1 when the first screen is loaded ([#292](https://github.com/aiktb/FuriganaMaker/issues/292)) ([3acf556](https://github.com/aiktb/FuriganaMaker/commit/3acf556a757e4c7ccd71b60903ca603637183c19))


### Miscellaneous Chores

* release 2.2.0 ([40faa7f](https://github.com/aiktb/FuriganaMaker/commit/40faa7fec09215352283cb678b5eae683a265022))

## v2.2.0

### Features

- Unify and beautify the options page style.
- Remove redundant custom rules and add rules reported by users.
- Allow reset config to initial state.

## v2.1.6

### Fix Bugs

- Console warning 'Each child in a list should have a unique "key" prop'.

## v2.1.5

### Fix Bugs

- Theme switcher icon disappeared.

## v2.1.4

### Fix Bugs

- Incorrect selector field description.
- Report error "not found content menu id".

## v2.1.3

### Fix Bugs

- Remove extra space on the right side of the language switcher.

## v2.1.2

### Fix Bugs

- Accidentally opened the official website.

## v2.1.1

### Fix Bugs

- Chrome context menu missing "add furigana" item.

## v2.1.0

### Features

- Add language switcher to the Options page.
- Allows turning off the "Page is too large" warning.
- Allows use of this extension on http sites.
- Allows kanji and furigana on the page to be colored together.
- Allows sites to be excluded from auto mode.
- Set settings page as homepage.

### Fix Bugs

- Complete the missing i18n translation of the page.
- 1024px width screen, a scroll bar appears on the x-axis.

## v2.0.2

### Fix Bugs

- Action active flag is displayed on pages without Japanese text.
- There's no need to open Changelog every time you update.

## v2.0.1

### Fix Bugs

- Web page oversize warnings appear too often.

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
- Support more shortcut keys. (See [this](https://github.com/aiktb/FuriganaMaker/blob/main/wxt.config.ts#L6))

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
