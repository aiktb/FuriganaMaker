import kuromoji from '@sglkc/kuromoji'

import type { PlasmoMessaging } from '@plasmohq/messaging'

import type { MojiToken } from '~contents/kanjiTokenizer'

// Referenced from @azu/kuromojin.
type Tokenizer = {
  tokenize: (text: string) => MojiToken[]
}

class Deferred {
  promise: Promise<Tokenizer>
  resolve!: (value: Tokenizer) => void
  reject!: (reason: Error) => void
  constructor() {
    this.promise = new Promise<Tokenizer>((resolve, reject) => {
      this.resolve = resolve
      this.reject = reject
    })
  }
}

const deferred = new Deferred()
let isLoading = false

const getTokenizer = () => {
  if (isLoading) {
    return deferred.promise
  }
  isLoading = true
  const builder = kuromoji.builder({
    // This function relies on web_accessible_resources.
    dicPath: '../../assets/dicts'
  })
  builder.build((err: undefined | Error, tokenizer: Tokenizer) => {
    if (err) {
      deferred.reject(err)
    } else {
      deferred.resolve(tokenizer)
    }
  })
  return deferred.promise
}

const handler: PlasmoMessaging.MessageHandler<
  { text: string },
  { message: MojiToken[] }
> = async (req, res) => {
  const tokenizer = await getTokenizer()
  const message: MojiToken[] = tokenizer.tokenize(req.body!.text)
  res.send({ message })
}

export default handler
