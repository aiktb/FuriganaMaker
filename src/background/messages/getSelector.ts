import type { PlasmoMessaging } from '@plasmohq/messaging';
import { Storage } from '@plasmohq/storage';

import { ExtensionStorage, type SelectorRule } from '~contents/core';

const storage = new Storage({ area: 'local' });
const handler: PlasmoMessaging.MessageHandler<{ domain: string }, { selector: string }> = async (
  req,
  res,
) => {
  const allRules: SelectorRule[] = await storage.get(ExtensionStorage.SelectorRules);

  const selector =
    allRules
      .filter((rule) => rule.domain === req.body?.domain && rule.active)
      .map((rule) => rule.selector)
      .join(', ') || '';

  res.send({ selector });
};

export default handler;
