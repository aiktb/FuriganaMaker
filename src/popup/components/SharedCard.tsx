import TelegramSquareIcon from "react:assets/icons/TelegramSquare.svg";

import { detect } from "detect-browser";
import { useTranslation } from "react-i18next";
import {
  FacebookShareButton,
  RedditShareButton,
  TelegramShareButton,
  TwitterShareButton,
  WhatsappShareButton,
} from "react-share";

import ToolTip from "./ToolTip";

export default function SharedCard() {
  const socialLinks = {
    chrome:
      "https://chromewebstore.google.com/detail/furigana-maker/heodojceeinbkfjfilnfminlkgbacpfp",
    firefox: "https://addons.mozilla.org/en-US/firefox/addon/furigana-maker/",
  };

  const browser = detect();
  let shareUrl: string;
  switch (browser?.name) {
    case "firefox":
      shareUrl = socialLinks.firefox;
      break;
    default:
      shareUrl = socialLinks.chrome;
  }

  const shareItems = [
    {
      ShareButton: TwitterShareButton,
      media: "Twitter",
      Icon: <span className="text-xl i-[fa6-brands--square-x-twitter]" />,
    },
    {
      ShareButton: FacebookShareButton,
      media: "Facebook",
      Icon: <span className="text-xl i-[fa6-brands--square-facebook]" />,
    },
    {
      ShareButton: WhatsappShareButton,
      media: "WhatsAPP",
      Icon: <span className="text-xl i-[fa6-brands--square-whatsapp]" />,
    },
    {
      ShareButton: TelegramShareButton,
      media: "Telegram",
      Icon: <TelegramSquareIcon className="text-xl" />,
    },
    {
      ShareButton: RedditShareButton,
      media: "Reddit",
      Icon: <span className="text-xl i-[fa6-brands--square-reddit]" />,
    },
  ];

  const { t } = useTranslation("popup");

  return (
    <div className="flex flex-1 items-center gap-1.5 px-2">
      {shareItems.map(({ ShareButton, media, Icon }) => (
        <ToolTip key={media} tip={t("tipShareOn", { media })}>
          <ShareButton
            resetButtonStyle={false}
            className="flex size-5 items-center justify-center transition hover:text-sky-500 focus-visible:text-sky-500"
            url={shareUrl}
          >
            {Icon}
          </ShareButton>
        </ToolTip>
      ))}
    </div>
  );
}
