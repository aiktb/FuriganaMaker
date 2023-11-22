import type { PlasmoMessaging } from '@plasmohq/messaging'
import { Storage } from '@plasmohq/storage'

import { ExtensionStorage, type Rule } from '~contents/core'

const storage = new Storage({ area: 'local' })
const handler: PlasmoMessaging.MessageHandler<{ domain: string }, { selector: string }> = async (
  req,
  res
) => {
  const allRules: Rule[] = await storage.get(ExtensionStorage.UserRules)

  const selector =
    allRules
      .filter((rule) => rule.domain === req.body!.domain && rule.active)
      .map((rule) => rule.selector)
      .join(', ') || ''

  res.send({ selector })
}

export default handler
