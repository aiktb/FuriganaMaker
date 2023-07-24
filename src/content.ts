import { toKurokanjiToken, type KurokanjiToken } from "kurokanji"
import type { PlasmoCSConfig } from "plasmo"

import { sendToBackground } from "@plasmohq/messaging"

import type {
  RequestBody,
  ResponseBody
} from "~background/messages/fetchKuromoji"

export const config: PlasmoCSConfig = {
  matches: ["https://twitter.com/*"],
  all_frames: true
}

const observer = new MutationObserver((records, observer) => {
  observer.disconnect()
  for (const record of records) {
    if (record.type === "childList" && record.addedNodes.length > 0) {
      for (const node of record.addedNodes) {
        if (node.nodeType === Node.ELEMENT_NODE) {
          const japaneseTweetNodes = (node as Element).querySelectorAll(
            'div[lang="ja"] span'
          )
          if (japaneseTweetNodes.length) {
            for (const jaNode of japaneseTweetNodes) {
              for (const node of getAllTextNodes(jaNode)) {
                addRubyTagsToNode(node)
              }
            }
          }
        }
      }
    }
  }
  observer.observe(document.body, { childList: true, subtree: true })
})
// MutationObserver must use an existing node
observer.observe(document.body, { childList: true, subtree: true })

async function tokenize(text: string): Promise<KurokanjiToken[]> {
  const response = await sendToBackground<RequestBody, ResponseBody>({
    name: "fetchKuromoji",
    body: {
      text: text
    }
  })
  return toKurokanjiToken(response.message)
}

function getAllTextNodes(node: Node): Set<Node> {
  const textNodes: Set<Node> = new Set()
  if (node.nodeType === Node.TEXT_NODE) {
    const textContent = node.textContent?.trim()
    if (textContent && textContent.length) {
      textNodes.add(node)
    }
  } else {
    for (const child of node.childNodes) {
      for (const node of getAllTextNodes(child)) {
        textNodes.add(node)
      }
    }
  }
  return textNodes
}
// node must have only one text child node
// <ruby>${token.original}<rt>${token.reading}</rt></ruby>
async function addRubyTagsToNode(node: Node) {
  const tokens: KurokanjiToken[] = await tokenize(node.textContent!)
  // reverse() prevents the range from being invalidated
  for (const token of tokens.reverse()) {
    const ruby = document.createElement("ruby")
    const originalText = document.createTextNode(token.original)
    const readingText = document.createTextNode(token.reading)
    const rt = document.createElement("rt")
    rt.appendChild(readingText)
    ruby.appendChild(originalText)
    ruby.appendChild(rt)
    ruby.classList.add("furigana")
    // This is an asynchronous bug (+ twitter bug), often the same node is executed twice addRubyTagsToNode(),
    // because tokenize is executed asynchronously, it will cause the two calls to get the same KurokanjiToken[],
    // but after one of them is completed, the content of node has been changed, and the return value is invalid.
    if (token.end > node.textContent!.length) {
      break
    }
    // range is [start, end), very good!
    const range = document.createRange()
    range.setStart(node, token.start)
    range.setEnd(node, token.end)
    range.deleteContents()
    range.insertNode(ruby)
  }
}
