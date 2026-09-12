import { useTranslation } from "react-i18next";
import type { useAiFurigana } from "../useAiFurigana";

const buttonClass =
  "rounded-lg bg-slate-900 px-4 py-2 text-sm text-white enabled:cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 dark:bg-slate-100 dark:text-slate-900";

export function AiModelPanel({
  ai,
  hasText,
  onGenerate,
}: {
  ai: ReturnType<typeof useAiFurigana>;
  hasText: boolean;
  onGenerate: () => void;
}) {
  const { t } = useTranslation();
  const busy = ai.phase !== "idle";
  const canSetup = ai.availability === "downloadable" || ai.availability === "downloading";
  return (
    <section
      aria-label={t("aiTitle")}
      className="mb-5 space-y-3 rounded-lg border border-slate-200 p-4 dark:border-slate-700"
    >
      <h2 className="font-semibold">{t("aiTitle")}</h2>
      <p className="text-slate-600 text-sm dark:text-slate-300">{t("aiDescription")}</p>
      <output data-testid="ai-model-status" className="block text-sm">
        {t(
          busy
            ? ai.phase === "preparing"
              ? "aiPreparing"
              : "aiGenerating"
            : `aiStatus_${ai.availability}`,
        )}
      </output>
      {ai.progress !== null ? (
        <div className="flex items-center gap-3 text-sm">
          <progress
            aria-label={t("aiDownloadProgress")}
            value={ai.progress}
            max={100}
            className="h-2 w-full"
          />
          <span>{ai.progress}%</span>
        </div>
      ) : null}
      {ai.error ? (
        <p role="alert" className="text-red-700 text-sm dark:text-red-300">
          {t(ai.error)}
        </p>
      ) : null}
      <div className="flex flex-wrap items-center gap-3">
        {busy ? (
          <button className={buttonClass} onClick={ai.stop}>
            {t("aiStop")}
          </button>
        ) : (
          <>
            {canSetup ? (
              <button className={buttonClass} onClick={() => ai.run()}>
                {t(ai.availability === "downloading" ? "aiTrackDownload" : "aiInstall")}
              </button>
            ) : null}
            <button
              className={buttonClass}
              disabled={ai.availability !== "available" || !hasText}
              onClick={onGenerate}
            >
              {t("aiGenerate")}
            </button>
            <button
              className="cursor-pointer text-sm underline"
              disabled={ai.availability === "checking"}
              onClick={ai.check}
            >
              {t("aiRecheck")}
            </button>
          </>
        )}
        <a
          className="text-sm underline"
          href="https://developer.chrome.com/docs/ai/prompt-api#hardware-requirements"
          target="_blank"
          rel="noreferrer"
        >
          {t("aiRequirements")}
        </a>
      </div>
    </section>
  );
}
