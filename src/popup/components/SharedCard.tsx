import { Icon } from "@iconify/react";
import { detect } from "detect-browser";
import {
  FacebookShareButton,
  RedditShareButton,
  TelegramShareButton,
  TwitterShareButton,
  WhatsappShareButton,
} from "react-share";

import TelegramSquareIcon from "react:~/assets/icons/TelegramSquare.svg";

import ToolTip from "./ToolTip";

export default function SharedCard() {
  const socialLinks = {
    chrome:
      "https://chromewebstore.google.com/detail/furigana-maker/heodojceeinbkfjfilnfminlkgbacpfp",
    firefox: "https://addons.mozilla.org/en-US/firefox/addon/furigana-maker/",
    edge: "https://microsoftedge.microsoft.com/addons/detail/furigana-maker/kohpoklaaeicnkdapjkmljdachedmbbi",
  };

  const browser = detect();
  let shareUrl: string;
  switch (browser?.name) {
    case "firefox":
      shareUrl = socialLinks.firefox;
      break;
    case "edge":
      shareUrl = socialLinks.edge;
      break;
    default:
      shareUrl = socialLinks.chrome;
  }

  // biome-ignore format: next-line
  const shareItems = [
    { ShareButton: TwitterShareButton, media: 'Twitter', Icon: <Icon className='text-xl' icon="fa6-brands:square-x-twitter" /> },
    { ShareButton: FacebookShareButton, media: 'Facebook', Icon: <Icon className='text-xl' icon="fa6-brands:square-facebook" /> },
    { ShareButton: WhatsappShareButton, media: 'WhatsAPP', Icon: <Icon className='text-xl' icon="fa6-brands:square-whatsapp" /> },
    { ShareButton: TelegramShareButton, media: 'Telegram', Icon: <TelegramSquareIcon className='text-xl' /> },
    { ShareButton: RedditShareButton, media: 'Reddit', Icon: <Icon className='text-xl' icon="fa6-brands:square-reddit" /> },
  ];

  return (
    <div className="flex flex-1 items-center gap-1.5 px-2">
      {shareItems.map(({ ShareButton, media, Icon }) => (
        <ToolTip key={media} tip={`Share on ${media}`}>
          <ShareButton
            resetButtonStyle={false}
            className="flex size-5 items-center justify-center transition hover:text-primary focus-visible:text-primary"
            url={shareUrl}
          >
            {Icon}
          </ShareButton>
        </ToolTip>
      ))}
    </div>
  );
}
