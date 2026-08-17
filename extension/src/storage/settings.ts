import defaultSelectorRules from "@/assets/rules/selector.json";
import {
  DisplayMode,
  ExtStorage,
  FuriganaType,
  type GeneralSettings,
  type MoreSettings,
  SelectMode,
  type SelectorRule,
} from "@/constants";

export const generalSettingsFallback = {
  [ExtStorage.AutoMode]: true,
  [ExtStorage.KanjiFilter]: false,
  [ExtStorage.DisplayMode]: DisplayMode.Always,
  [ExtStorage.FuriganaType]: FuriganaType.Hiragana,
  [ExtStorage.SelectMode]: SelectMode.Default,
  [ExtStorage.FontSize]: 75,
  [ExtStorage.FontColor]: "currentColor",
} satisfies GeneralSettings;

export const generalSettings = storage.defineItem<GeneralSettings>("local:generalSettings", {
  version: 1,
  fallback: generalSettingsFallback,
});

export async function setGeneralSettings<K extends keyof GeneralSettings>(
  key: K,
  value: GeneralSettings[K],
) {
  await generalSettings.setValue({ ...(await generalSettings.getValue()), [key]: value });
}

export async function getGeneralSettings<K extends keyof GeneralSettings>(key: K) {
  return (await generalSettings.getValue())[key];
}

export const moreSettingsFallback = {
  [ExtStorage.Language]: null,
  [ExtStorage.DisableWarning]: false,
  [ExtStorage.ColoringKanji]: false,
  [ExtStorage.IncludeSites]: ["*"],
  [ExtStorage.ExcludeSites]: [],
  [ExtStorage.AlwaysRunSites]: [],
} satisfies MoreSettings;

export const moreSettings = storage.defineItem<MoreSettings>("local:moreSettings", {
  version: 3,
  fallback: moreSettingsFallback,
  migrations: {
    2: (oldValue: Omit<MoreSettings, "alwaysRunSites">) => ({
      ...oldValue,
      [ExtStorage.AlwaysRunSites]: [],
    }),
    3: (oldValue: Omit<MoreSettings, "includeSites">) => ({
      ...oldValue,
      [ExtStorage.IncludeSites]: ["*"],
    }),
  },
});

export async function getMoreSettings<K extends keyof MoreSettings>(key: K) {
  return (await moreSettings.getValue())[key];
}

export async function setMoreSettings<K extends keyof MoreSettings>(
  key: K,
  value: MoreSettings[K],
) {
  await moreSettings.setValue({ ...(await moreSettings.getValue()), [key]: value });
}

/**
 * Changing this key will result in destructive changes, so it cannot be modified.
 */
export const customSelectors = storage.defineItem<SelectorRule[]>("local:customRules", {
  version: 1,
  fallback: defaultSelectorRules,
});
