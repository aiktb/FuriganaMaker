import { debounce } from "es-toolkit";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ExtStorage, type GeneralSettings } from "@/commons/constants";
import { generalSettings, generalSettingsFallback } from "@/commons/utils";

const STORAGE_WRITE_DEBOUNCE_WAIT = 100;
/**
 * Debounce storage writes to avoid async write order inversions and excessive
 * calls that can exceed Chrome extension storage API limits.
 */
const setGeneralSettingsDebounced = debounce((value: GeneralSettings) => {
  generalSettings.setValue(value);
}, STORAGE_WRITE_DEBOUNCE_WAIT);

interface GeneralSettingsStore extends GeneralSettings {
  toggleAutoMode: () => void;
  toggleKanjiFilter: () => void;
  setDisplayMode: (mode: GeneralSettings["displayMode"]) => void;
  setFuriganaType: (type: GeneralSettings["furiganaType"]) => void;
  setSelectMode: (mode: GeneralSettings["selectMode"]) => void;
  setFontSize: (size: GeneralSettings["fontSize"]) => void;
  setFontColor: (color: GeneralSettings["fontColor"]) => void;
}
export const useGeneralSettingsStore = create<GeneralSettingsStore>()(
  persist(
    (set, get) => ({
      ...generalSettingsFallback,
      toggleAutoMode: () => {
        set({ [ExtStorage.AutoMode]: !get()[ExtStorage.AutoMode] });
      },
      toggleKanjiFilter: () => {
        set({ [ExtStorage.KanjiFilter]: !get()[ExtStorage.KanjiFilter] });
      },
      setDisplayMode: (mode) => {
        set({ [ExtStorage.DisplayMode]: mode });
      },
      setFuriganaType: (type) => {
        set({ [ExtStorage.FuriganaType]: type });
      },
      setSelectMode: (mode) => {
        set({ [ExtStorage.SelectMode]: mode });
      },
      setFontSize: (size) => {
        set({ [ExtStorage.FontSize]: size });
      },
      setFontColor: (color) => {
        set({ [ExtStorage.FontColor]: color });
      },
    }),
    {
      name: "more-settings-storage",
      storage: {
        async getItem() {
          return {
            state: await generalSettings.getValue(),
          };
        },
        setItem(_, value) {
          setGeneralSettingsDebounced(value.state);
        },
        async removeItem() {
          await generalSettings.removeValue();
        },
      },
    },
  ),
);

generalSettings.watch((value) => {
  useGeneralSettingsStore.setState(value);
});
