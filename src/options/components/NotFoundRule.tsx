import { useTranslation } from "react-i18next";

export default function NotFoundRule() {
  const { t } = useTranslation("options");

  return (
    <div className="flex flex-col items-center px-6 pb-24 pt-16 text-center">
      <i className="size-20 text-sky-500 i-fluent-location-not-found-24-regular" />
      <h1 className="space-x-[2px] pt-3 text-xl font-bold leading-5 text-sky-500">
        {t("titleNotFound")}
      </h1>
      <div className="mx-auto mb-[18px] mt-6 h-[1px] w-16 bg-sky-500" />
      <p className="mx-auto my-0 max-w-[256px] text-base font-[500]">{t("msgNotFound")}</p>
    </div>
  );
}
