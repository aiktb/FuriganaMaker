import { FURIGANA_CLASS_NAME } from '~contents/core'

export class Selector {
  readonly #renderer = new Renderer()
  readonly #onElementSelected: (element: HTMLElement) => void
  readonly #mouseoverHandler = (event: Event) => {
    event.stopPropagation()
    this.#renderer.hide()
    if (event.target === document.body) {
      return
    }
    this.#renderer.add(event.target! as HTMLElement)
  }

  readonly #clickHandler = (event: Event) => {
    const target = event.target! as HTMLElement
    // Only need to handle events triggered non-programmatically.
    if (!event.isTrusted) {
      return
    }
    // The jump event of click an internal link in Vue SPA is not a default event and cannot be prevented.
    event.preventDefault()
    event.stopImmediatePropagation()
    this.#onElementSelected(target)
  }

  constructor(onElementSelected: (element: HTMLElement) => void) {
    this.#onElementSelected = onElementSelected
    const elements = document.querySelectorAll(
      `body *:not(.${FURIGANA_CLASS_NAME})`
    )
    Array.from(elements).forEach((element) => {
      element.addEventListener('mouseover', this.#mouseoverHandler)
      element.addEventListener('click', this.#clickHandler)
    })
  }

  readonly close = () => {
    this.#renderer.close()
    const elements = document.querySelectorAll('body *')
    Array.from(elements).forEach((element) => {
      element.removeEventListener('mouseover', this.#mouseoverHandler)
      element.removeEventListener('click', this.#clickHandler)
    })
  }
}

const px = (num: number) => `${num}px`
const BORDER_WIDTH = 5
const PADDING_WIDTH = 2
const GENERAL_CSS = {
  position: 'absolute',
  display: 'none',
  background: '#0d99ff',
  borderRadius: '5px',
  zIndex: 2147483646
}
const BOTTOM_DIV_CSS = {
  position: 'absolute',
  display: 'none',
  color: 'white',
  overflow: 'hidden',
  background: '#0d99ff',
  paddingLeft: `${px(BORDER_WIDTH)}`,
  paddingRight: `${px(BORDER_WIDTH)}`,
  boxSizing: 'border-box',
  fontSize: `${px(BORDER_WIDTH * 2)}`,
  fontWeight: 'bold',
  lineHeight: `${px(BORDER_WIDTH * 4)}`,
  zIndex: 2147483646
}

class Renderer {
  readonly #left = document.createElement('div')
  readonly #right = document.createElement('div')
  readonly #top = document.createElement('div')
  readonly #bottom = document.createElement('div')
  readonly #getTagPath = (element: HTMLElement) => {
    if (element.parentNode) {
      return `${(
        element.parentNode as HTMLElement
      ).tagName.toLowerCase()} ${element.tagName.toLowerCase()}`
    }
    return element.tagName.toLowerCase()
  }
  constructor() {
    document.documentElement.appendChild(this.#left)
    document.documentElement.appendChild(this.#right)
    document.documentElement.appendChild(this.#top)
    document.documentElement.appendChild(this.#bottom)
    Object.assign(this.#left.style, GENERAL_CSS)
    Object.assign(this.#right.style, GENERAL_CSS)
    Object.assign(this.#top.style, GENERAL_CSS)
    Object.assign(this.#bottom.style, { ...GENERAL_CSS, ...BOTTOM_DIV_CSS })
  }

  public readonly close = () => {
    document.documentElement.removeChild(this.#left)
    document.documentElement.removeChild(this.#right)
    document.documentElement.removeChild(this.#top)
    document.documentElement.removeChild(this.#bottom)
  }

  public readonly hide = () => {
    this.#left.style.display = 'none'
    this.#right.style.display = 'none'
    this.#top.style.display = 'none'
    this.#bottom.style.display = 'none'
  }

  public readonly add = (element: HTMLElement) => {
    this.hide()

    // Reference: https://smms.app/image/vEHQ3UiTBs6jqV4
    // left&top are relative to the upper left corner of the viewport rather
    // than the upper left corner of the web page.
    const { left, top, width, height } = element.getBoundingClientRect()
    const outerLeft = left + window.scrollX - BORDER_WIDTH - PADDING_WIDTH
    const outerTop = top + window.scrollY - BORDER_WIDTH - PADDING_WIDTH
    const outerWidth = width + BORDER_WIDTH * 2 + PADDING_WIDTH * 2
    const outerHeight = height + BORDER_WIDTH * 4 + PADDING_WIDTH * 2

    // Just a tooltip cobbled together with absolute positioning, don't read.
    this.#left.style.left = px(outerLeft)
    this.#left.style.top = px(outerTop)
    this.#left.style.width = px(BORDER_WIDTH)
    this.#left.style.height = px(outerHeight)

    this.#right.style.left = px(outerLeft + outerWidth - BORDER_WIDTH)
    this.#right.style.top = px(outerTop)
    this.#right.style.width = px(BORDER_WIDTH)
    this.#right.style.height = px(outerHeight)

    this.#top.style.left = px(outerLeft)
    this.#top.style.top = px(outerTop)
    this.#top.style.width = px(outerWidth)
    this.#top.style.height = px(BORDER_WIDTH)

    this.#bottom.style.left = px(outerLeft)
    this.#bottom.style.top = px(outerTop + outerHeight - BORDER_WIDTH * 3)
    this.#bottom.style.width = px(outerWidth)
    this.#bottom.style.height = px(BORDER_WIDTH * 4)
    this.#bottom.textContent = this.#getTagPath(element)

    this.#right.style.display = 'block'
    this.#left.style.display = 'block'
    this.#top.style.display = 'block'
    this.#bottom.style.display = 'block'
  }
}
