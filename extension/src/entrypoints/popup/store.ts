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

interface GeneralSettingsStoreActions {
  toggleAutoMode: () => void;
  toggleKanjiFilter: () => void;
  setDisplayMode: (mode: GeneralSettings["displayMode"]) => void;
  setFuriganaType: (type: GeneralSettings["furiganaType"]) => void;
  setSelectMode: (mode: GeneralSettings["selectMode"]) => void;
  setFontSize: (size: GeneralSettings["fontSize"]) => void;
  setFontColor: (color: GeneralSettings["fontColor"]) => void;
}
interface GeneralSettingsStoreState {
  data: GeneralSettings;
  actions: GeneralSettingsStoreActions;
}
type PersistedGeneralSettingsStoreState = Pick<GeneralSettingsStoreState, "data">;

export const useGeneralSettingsStore = create<GeneralSettingsStoreState>()(
  persist(
    (set, get) => ({
      data: generalSettingsFallback,
      actions: {
        toggleAutoMode: () => {
          set(({ data }) => ({
            data: { ...data, [ExtStorage.AutoMode]: !get().data[ExtStorage.AutoMode] },
          }));
        },
        toggleKanjiFilter: () => {
          set(({ data }) => ({
            data: { ...data, [ExtStorage.KanjiFilter]: !get().data[ExtStorage.KanjiFilter] },
          }));
        },
        setDisplayMode: (mode) => {
          set(({ data }) => ({ data: { ...data, [ExtStorage.DisplayMode]: mode } }));
        },
        setFuriganaType: (type) => {
          set(({ data }) => ({ data: { ...data, [ExtStorage.FuriganaType]: type } }));
        },
        setSelectMode: (mode) => {
          set(({ data }) => ({ data: { ...data, [ExtStorage.SelectMode]: mode } }));
        },
        setFontSize: (size) => {
          set(({ data }) => ({ data: { ...data, [ExtStorage.FontSize]: size } }));
        },
        setFontColor: (color) => {
          set(({ data }) => ({ data: { ...data, [ExtStorage.FontColor]: color } }));
        },
      },
    }),
    {
      name: "general-settings-storage",
      partialize: (state): PersistedGeneralSettingsStoreState => ({ data: state.data }),
      storage: {
        async getItem() {
          return {
            state: { data: await generalSettings.getValue() },
          };
        },
        setItem(_, value) {
          setGeneralSettingsDebounced(value.state.data);
        },
        async removeItem() {
          await generalSettings.removeValue();
        },
      },
    },
  ),
);

generalSettings.watch((value) => {
  useGeneralSettingsStore.setState({ data: value });
});
