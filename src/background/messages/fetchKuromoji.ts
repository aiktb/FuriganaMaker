import type { KuromojiToken } from "kurokanji";

import type { PlasmoMessaging } from "@plasmohq/messaging";

export type RequestBody = {
  text: string;
};

export type ResponseBody = {
  message: KuromojiToken[];
};

const handler: PlasmoMessaging.MessageHandler<
  RequestBody,
  ResponseBody
> = async (req, res) => {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text: req.body!.text,
    }),
  };
  const response = await fetch(
    "https://api.aiktb.com/tokenizer",
    requestOptions,
  );
  const message: KuromojiToken[] = await response.json();

  res.send({
    message,
  });
};

export default handler;
