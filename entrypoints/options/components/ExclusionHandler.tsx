import { Dialog, DialogPanel, DialogTitle, Field, Input } from "@headlessui/react";
import { t } from "i18next";
import { useTranslation } from "react-i18next";
import PopupTransition from "./PopupTransition";

interface ExclusionHandlerProps {
  sites: string[];
  onChange: (sites: string[]) => void;
}
export default function ExclusionHandler({ sites, onChange }: ExclusionHandlerProps) {
  const [dialogIsOpen, setDialogIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const { t } = useTranslation();

  return (
    <li className="gap-4 items-center w-full justify-between">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-slate-800 dark:text-slate-200 text-lg font-bold">
            {t("settingsExclusionList")}
          </div>
          <div>{t("settingsExclusionListDesc")}</div>
        </div>
        <div className="flex gap-2 flex-col sm:flex-row">
          <button
            className="rounded-md bg-white/5 py-2 px-4 text-white"
            onClick={() => {
              setDialogIsOpen(true);
            }}
          >
            {t("btnAdd")}
          </button>
          <PopupTransition show={dialogIsOpen}>
            <Dialog
              as="div"
              className="-translate-x-1/2 -translate-y-1/2 fixed top-1/2 left-1/2 z-40"
              onClose={() => {
                setDialogIsOpen(false);
              }}
            >
              <DialogPanel className="text-base w-full min-w-[28rem] max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all dark:bg-slate-900">
                <DialogTitle
                  as="h3"
                  className="font-medium text-gray-900 text-lg leading-6 dark:text-white"
                >
                  {t("dialogExcludeTitle")}
                </DialogTitle>
                <Field>
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && input) {
                        onChange([...sites, input]);
                        setInput("");
                        setDialogIsOpen(false);
                      }
                    }}
                    placeholder="example.com"
                    autoFocus={true}
                    className={
                      "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25 mt-3 block w-full rounded-lg border-none bg-white/5 py-1.5 px-3 text-sm/6 text-white"
                    }
                  />
                </Field>
                <div className="mt-3 flex gap-2 w-full justify-end">
                  <button
                    className="rounded-md bg-white/5 py-2 px-4 text-white"
                    onClick={() => {
                      setInput("");
                      setDialogIsOpen(false);
                    }}
                  >
                    {t("btnCancel")}
                  </button>
                  <button
                    className="rounded-md bg-white/5 py-2 px-4 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!input}
                    onClick={() => {
                      onChange([...sites, input]);
                      setInput("");
                      setDialogIsOpen(false);
                    }}
                  >
                    {t("btnOK")}
                  </button>
                </div>
              </DialogPanel>
            </Dialog>
          </PopupTransition>
          <button
            className="rounded-md bg-white/5 py-2 px-4 text-white text-nowrap"
            onClick={() => onChange([])}
          >
            {t("btnClearAll")}
          </button>
        </div>
      </div>
      <SiteList sites={sites} onChange={onChange} />
    </li>
  );
}

function SiteList({ sites, onChange }: ExclusionHandlerProps) {
  return (
    <div className="bg-white/5 rounded-lg p-4 text-slate-200 space-y-2">
      {sites.length === 0 ? (
        <div className="flex items-center justify-center">{t("messageEmptyList")}</div>
      ) : (
        sites.map((site) => (
          <div key={site} className="flex justify-between">
            <div className="select-all">{site}</div>
            <button
              className="text-slate-300 hover:text-slate-100 items-center flex"
              onClick={() => {
                onChange(sites.filter((s) => s !== site));
              }}
            >
              <span className="sr-only">{t("btnDelete")}</span>
              <i className="size-5 i-tabler-x" />
            </button>
          </div>
        ))
      )}
    </div>
  );
}
