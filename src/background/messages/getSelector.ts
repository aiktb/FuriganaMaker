import type { PlasmoMessaging } from '@plasmohq/messaging'
import { Storage } from '@plasmohq/storage'

import { Rule, Selector } from '~contents/core'

const storage = new Storage({ area: 'local' })
const handler: PlasmoMessaging.MessageHandler<
  { domain: string },
  { selectors: Selector[] }
> = async (req, res) => {
  const rules: Rule[] = await storage.get('rules')
  const ruleMap = new Map(rules.map((rule) => [rule.domain, rule.selector]))
  const selectors: Selector[] = ruleMap.get(req.body!.domain) ?? []
  res.send({ selectors })
}

export default handler
