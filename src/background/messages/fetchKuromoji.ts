import type { PlasmoMessaging } from '@plasmohq/messaging'

import type { KuromojiToken } from '~util/kurokanji'

const handler: PlasmoMessaging.MessageHandler<
  { text: string },
  { message: KuromojiToken[] }
> = async (req, res) => {
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      text: req.body!.text
    })
  }
  const response = await fetch(
    'https://api.aiktb.com/tokenizer',
    requestOptions
  )
  const message: KuromojiToken[] = await response.json()

  res.send({ message })
}

export default handler
