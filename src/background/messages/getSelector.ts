import type { PlasmoMessaging } from '@plasmohq/messaging'
import { Storage } from '@plasmohq/storage'

import { ExtensionStorage, Selector, type Rule } from '~contents/core'

const storage = new Storage({ area: 'local' })
const handler: PlasmoMessaging.MessageHandler<
  { domain: string },
  { selector: Selector }
> = async (req, res) => {
  const allRules: Rule[] = await storage.get(ExtensionStorage.UserRule)

  const validRules = allRules.filter(
    (rule) => rule.domain === req.body!.domain && rule.enabled
  )

  const plain =
    validRules
      .filter((rule) => !rule.dynamic)
      .map((rule) => rule.selector)
      .join(', ') || undefined
  const observer =
    validRules
      .filter((rule) => rule.dynamic)
      .map((rule) => rule.selector)
      .join(', ') || undefined
  const selector: Selector = { plain, observer }

  res.send({ selector })
}

export default handler
