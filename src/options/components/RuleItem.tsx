import { Dialog } from "@headlessui/react";
import { useState } from "react";

import type { SelectorRule } from "~core/constants";

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

  return (
    <>
      <div className="flex flex-col justify-between gap-x-6 py-5 sm:flex-row">
        <div className="flex min-w-0 gap-x-4">
          <span
            className="size-12 flex-none text-sky-500 i-[solar--layers-minimalistic-outline]"
            aria-hidden="true"
          />
          <div className="flex-auto">
            <a
              className="truncate text-sm font-semibold leading-6 text-sky-500 transition hover:text-sky-700"
              href={encodeURI(`https://${rule.domain}`)}
              target="_blank"
              rel="noopener noreferrer"
            >
              {rule.domain}
            </a>
            <p className="w-72 truncate text-xs leading-5 sm:w-96 md:w-[30rem] lg:w-[36rem]">
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
              <p className="text-sm leading-5 transition hover:text-slate-950 dark:hover:text-white">
                {rule.active ? "Active" : "Inactive"}
              </p>
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
                className="flex items-center gap-x-1 rounded-md border border-gray-200 px-1 py-0.5 text-sm font-bold text-sky-500 shadow transition-[background-color] hover:bg-transparent/10 dark:border-slate-800 dark:hover:bg-transparent/20"
                onClick={() => {
                  setEditorIsOpen(true);
                }}
              >
                <span className="size-4 i-[tabler--edit]" aria-hidden="true" />
                Edit
              </button>
              <button
                className="flex items-center gap-x-1 rounded-md border border-gray-200 px-1 py-0.5 text-sm font-bold text-sky-500 shadow transition-[background-color] hover:bg-transparent/10 dark:border-slate-800 dark:hover:bg-transparent/20"
                onClick={() => {
                  setDeleteDialogIsOpen(true);
                }}
              >
                <span className="size-4 i-[tabler--trash]" aria-hidden="true" />
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      <PopupTransition show={editorDialogIsOpen}>
        <Dialog
          as="div"
          className="fixed left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2"
          onClose={() => {
            setEditorIsOpen(false);
          }}
        >
          <Dialog.Panel className="w-full min-w-[28rem] max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all dark:bg-slate-900">
            <RuleEditor
              rule={rule}
              mode="update"
              onChange={(rule) => {
                onChange(rule);
                setEditorIsOpen(false);
              }}
            />
          </Dialog.Panel>
        </Dialog>
      </PopupTransition>

      <PopupTransition show={deleteDialogIsOpen}>
        <Dialog
          as="div"
          className="fixed left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2"
          onClose={() => {
            setDeleteDialogIsOpen(false);
          }}
        >
          <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all dark:bg-slate-900">
            <Dialog.Title
              as="h3"
              className="text-lg font-medium leading-6 text-gray-900 dark:text-white"
            >
              Warning!
            </Dialog.Title>
            <div className="mt-2">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                The deletion rule is not undoable, sure about this?
              </p>
            </div>
            <div className="mt-4 flex gap-2.5">
              <button
                className="inline-flex justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-slate-900 transition hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 dark:bg-red-800 dark:text-slate-200 dark:hover:bg-red-900"
                onClick={() => {
                  onDelete(rule);
                  setDeleteDialogIsOpen(false);
                }}
              >
                Delete
              </button>
              <button
                className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 transition hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                onClick={() => {
                  setDeleteDialogIsOpen(false);
                }}
              >
                Cancel
              </button>
            </div>
          </Dialog.Panel>
        </Dialog>
      </PopupTransition>
    </>
  );
}
