import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";

import type { SelectorRule } from "@/commons/constants";

import { useTranslation } from "react-i18next";
import PopupTransition from "./PopupTransition";
import RuleEditor from "./RuleEditor";

interface RuleItemProps {
  rule: SelectorRule;
  onChange: (rule: SelectorRule) => void;
  onDelete: (rule: SelectorRule) => void;
}

export default function RuleItem({ rule, onChange, onDelete }: RuleItemProps) {
  const [editorDialogIsOpen, setEditorIsOpen] = useState(false);
  const [deleteDialogIsOpen, setDeleteDialogIsOpen] = useState(false);

  const { t } = useTranslation();

  return (
    <>
      <div className="flex flex-col justify-between gap-x-6 py-5 sm:flex-row">
        <div className="flex min-w-0 gap-x-4">
          <i className="i-tabler-layers-intersect size-12 flex-none text-sky-500" />
          <div className="flex-auto">
            <a
              className="flex-inline items-center w-auto truncate font-semibold text-sm leading-6 transition text-black dark:text-white underline decoration-solid"
              href={encodeURI(`https://${rule.domain}`)}
              target="_blank"
              rel="noopener noreferrer"
            >
              {rule.domain}
              <i className="i-tabler-arrow-up-right" />
            </a>
            <p className="max-w-72 truncate text-xs leading-5 lg:max-w-[36rem] md:max-w-[30rem] sm:max-w-96">
              {rule.selector}
            </p>
          </div>
        </div>
        <div className="flex shrink-0 flex-col items-end">
          <div className="flex w-full items-center justify-between gap-x-1.5 sm:flex-col sm:items-end sm:justify-evenly">
            <button
              className="mr-1 flex flex-row-reverse items-center gap-x-1.5 sm:flex-row"
              onClick={() => {
                onChange({ ...rule, active: !rule.active });
              }}
            >
              <div className="text-sm leading-5 transition dark:hover:text-white hover:text-slate-950">
                {rule.active ? t("markActive") : t("markInactive")}
              </div>
              <span className="relative flex size-2">
                <span
                  className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${
                    rule.active ? "bg-sky-400" : "bg-gray-400"
                  }`}
                />
                <span
                  className={`relative inline-flex size-2 rounded-full ${
                    rule.active ? "bg-sky-500" : "bg-gray-500"
                  }`}
                />
              </span>
            </button>
            <div className="mt-1 flex gap-x-1.5">
              <button
                className="flex items-center gap-x-1 rounded-md border border-gray-200 px-1 py-0.5 font-bold text-slate-700 text-sm shadow transition-[background-color] dark:border-slate-700 dark:hover:bg-transparent/20 hover:bg-transparent/10 dark:text-slate-300"
                onClick={() => {
                  setEditorIsOpen(true);
                }}
              >
                <i className="i-tabler-edit size-4 text-sky-500" />
                {t("btnEdit")}
              </button>
              <button
                className="flex items-center gap-x-1 rounded-md border border-gray-200 px-1 py-0.5 font-bold text-slate-700 text-sm shadow transition-[background-color] dark:border-slate-700 dark:hover:bg-transparent/20 hover:bg-transparent/10 dark:text-slate-300"
                onClick={() => {
                  setDeleteDialogIsOpen(true);
                }}
              >
                <i className="i-tabler-trash size-4 text-sky-500" />
                {t("btnDelete")}
              </button>
            </div>
          </div>
        </div>
      </div>

      <PopupTransition show={editorDialogIsOpen}>
        <Dialog
          as="div"
          className="-translate-x-1/2 -translate-y-1/2 fixed top-1/2 left-1/2 z-40"
          onClose={() => {
            setEditorIsOpen(false);
          }}
        >
          <DialogPanel className="w-full min-w-[28rem] max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all dark:bg-slate-900">
            <RuleEditor
              rule={rule}
              mode="update"
              onChange={(rule) => {
                onChange(rule);
                setEditorIsOpen(false);
              }}
            />
          </DialogPanel>
        </Dialog>
      </PopupTransition>

      <PopupTransition show={deleteDialogIsOpen}>
        <Dialog
          as="div"
          className="-translate-x-1/2 -translate-y-1/2 fixed top-1/2 left-1/2 z-40"
          onClose={() => {
            setDeleteDialogIsOpen(false);
          }}
        >
          <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all dark:bg-slate-900">
            <DialogTitle
              as="h3"
              className="font-medium text-gray-900 text-lg leading-6 dark:text-white"
            >
              {t("titleWarning")}
            </DialogTitle>
            <div className="mt-2">
              <p className="text-gray-500 text-sm dark:text-gray-400">{t("msgDeleteRule")}</p>
            </div>
            <div className="mt-4 flex gap-2.5">
              <button
                className="inline-flex justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 font-medium text-slate-900 text-sm transition dark:bg-red-800 dark:hover:bg-red-900 hover:bg-red-200 dark:text-slate-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                onClick={() => {
                  onDelete(rule);
                  setDeleteDialogIsOpen(false);
                }}
              >
                {t("btnDelete")}
              </button>
              <button
                className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 font-medium text-blue-900 text-sm transition dark:bg-slate-700 dark:hover:bg-slate-800 hover:bg-blue-200 dark:text-slate-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                onClick={() => {
                  setDeleteDialogIsOpen(false);
                }}
              >
                {t("btnCancel")}
              </button>
            </div>
          </DialogPanel>
        </Dialog>
      </PopupTransition>
    </>
  );
}
