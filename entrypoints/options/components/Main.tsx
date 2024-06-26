import { Dialog, DialogPanel, DialogTitle, Transition } from "@headlessui/react";
import { saveAs } from "file-saver";
import { use, useEffect, useState } from "react";
import { z } from "zod";

import { ExtStorage, type SelectorRule } from "@/commons/constants";

import { useTranslation } from "react-i18next";
import NotFoundRule from "./NotFoundRule";
import PopupTransition from "./PopupTransition";
import RuleEditor from "./RuleEditor";
import RuleItem from "./RuleItem";

export default function Main({ rulesPromise }: { rulesPromise: Promise<SelectorRule[]> }) {
  const [rules, setRules] = useState(use(rulesPromise));
  const [createRuleDialogIsOpen, setCreateRuleDialogIsOpen] = useState(false);
  const [importDialogIsOpen, setImportDialogIsOpen] = useState(false);
  const [importFailedDialogIsOpen, setImportFailedDialogIsOpen] = useState(false);
  const [importFailedMessage, setImportFailedMessage] = useState("");

  useEffect(() => {
    storage.setItem(`local:${ExtStorage.SelectorRules}`, rules);
  }, [rules]);

  function createNewRule(rule: SelectorRule) {
    const sameDomainRule = rules.find((r) => r.domain === rule.domain);
    if (sameDomainRule) {
      const mergedRule = {
        ...sameDomainRule,
        selector: `${rule.selector}, ${sameDomainRule.selector}`,
      };
      const filteredRules = rules.filter((r) => r.domain !== rule.domain);
      setRules([mergedRule, ...filteredRules]);
    } else {
      setRules([rule, ...rules]);
    }
    setCreateRuleDialogIsOpen(false);
  }

  function exportConfig() {
    const blob = new Blob([JSON.stringify(rules, null, 2)], { type: "application/json" });
    saveAs(blob, "FuriganaMakerConfig.json");
  }

  async function importConfig() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";

    const file: File | null | undefined = await new Promise((resolve) => {
      input.addEventListener("change", () => {
        resolve(input.files?.length ? input.files[0] : null);
      });
      input.click();
    });

    if (file) {
      const reader = new FileReader();
      reader.onload = async () => {
        const checkResult = checkJSONErrorMessage(reader.result as string);
        if (checkResult) {
          setImportFailedMessage(checkResult);
          setImportFailedDialogIsOpen(true);
          return;
        }
        const importedRules = JSON.parse(reader.result as string) as SelectorRule[];
        const mergedRules = mergeSameDomainRules(importedRules);

        await storage.setItem(`local:${ExtStorage.SelectorRules}`, mergedRules);
        setRules(mergedRules);
      };
      reader.readAsText(file);
    }

    function mergeSameDomainRules(rules: SelectorRule[]) {
      return rules.reduce((acc, cur) => {
        const index = acc.findIndex((item) => item.domain === cur.domain);
        if (index !== -1) {
          acc[index]!.selector = `${acc[index]!.selector}, ${cur.selector}`;
        } else {
          acc.push(cur);
        }
        return acc;
      }, [] as SelectorRule[]);
    }

    function checkJSONErrorMessage(data: string) {
      try {
        const RuleSchema = z.object({
          domain: z.string(),
          selector: z.string(),
          active: z.boolean(),
        });
        const RulesSchema = z.array(RuleSchema);
        const result = RulesSchema.safeParse(JSON.parse(data));
        return result.success ? null : result.error.message;
      } catch (error) {
        return (error as Error).message;
      }
    }
  }

  const { t } = useTranslation();

  return (
    <>
      <main className="flex grow flex-col justify-start">
        <div className="mx-auto my-2 flex max-w-5xl flex-col items-center justify-between gap-1.5 px-5 text-base font-bold text-sky-500 sm:px-6 md:flex-row md:justify-between lg:max-w-7xl lg:px-8">
          <button
            className="flex items-center gap-x-1.5 rounded-md border border-gray-200 px-1.5 py-0.5 shadow-md transition-[background-color] hover:bg-transparent/10 dark:border-slate-800 dark:hover:bg-transparent/20"
            onClick={() => {
              setCreateRuleDialogIsOpen(true);
            }}
          >
            <i className="size-5 i-tabler-code-plus" />
            {t("btnAddRule")}
          </button>
          <div className="flex gap-x-1.5">
            <button
              className={`${
                rules.length === 0 ? "cursor-not-allowed" : ""
              } flex items-center gap-x-1.5 rounded-md border border-gray-200 px-1.5 py-0.5 shadow-md transition-[background-color] hover:bg-transparent/10 dark:border-slate-800 dark:hover:bg-transparent/20`}
              onClick={exportConfig}
            >
              <i className="size-5 i-tabler-file-export" />
              {t("btnExportConfig")}
            </button>
            <button
              className="flex cursor-pointer items-center gap-x-1.5 rounded-md border border-gray-200 px-1.5 py-0.5 shadow-md transition-[background-color] hover:bg-transparent/10 dark:border-slate-800 dark:hover:bg-transparent/20"
              onClick={() => {
                setImportDialogIsOpen(true);
              }}
            >
              <i className="size-5 i-tabler-file-import" />
              {t("btnImportConfig")}
            </button>
          </div>
        </div>
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 sm:px-6 lg:max-w-7xl lg:px-8">
          {rules.length === 0 ? (
            <NotFoundRule />
          ) : (
            <ul className="divide-y divide-gray-100 dark:divide-slate-800">
              {rules.map((rule) => {
                return (
                  <Transition
                    appear
                    as="div"
                    show={true}
                    key={rule.domain}
                    enter="transition-opacity duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="transition-opacity duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <RuleItem
                      rule={rule}
                      onChange={(rule) => {
                        const index = rules.findIndex((r) => r.domain === rule.domain);
                        const newRules = [...rules];
                        newRules[index] = rule;
                        setRules(newRules);
                      }}
                      onDelete={(rule) => {
                        const index = rules.findIndex((r) => r.domain === rule.domain);
                        const newRules = [...rules];
                        newRules.splice(index, 1);
                        setRules(newRules);
                      }}
                    />
                  </Transition>
                );
              })}
            </ul>
          )}
        </div>
      </main>

      <PopupTransition show={createRuleDialogIsOpen}>
        <Dialog
          as="div"
          className="fixed left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2"
          onClose={() => {
            setCreateRuleDialogIsOpen(false);
          }}
        >
          <DialogPanel className="w-full min-w-[28rem] max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all dark:bg-slate-900">
            <RuleEditor mode="create" onChange={createNewRule} />
          </DialogPanel>
        </Dialog>
      </PopupTransition>

      <PopupTransition show={importDialogIsOpen}>
        <Dialog
          as="div"
          className="fixed left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2"
          onClose={() => {
            setImportDialogIsOpen(false);
          }}
        >
          <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all dark:bg-slate-900">
            <DialogTitle
              as="h3"
              className="text-lg font-medium leading-6 text-gray-900 dark:text-white"
            >
              {t("titleWarning")}
            </DialogTitle>
            <div className="mt-2">
              <p className="text-sm text-gray-500 dark:text-gray-400">{t("msgImportConfig")}</p>
            </div>
            <div className="mt-4 flex gap-2.5">
              <button
                className="inline-flex justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-slate-900 transition hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 dark:bg-red-800 dark:text-slate-200 dark:hover:bg-red-900"
                onClick={() => {
                  importConfig();
                  setImportDialogIsOpen(false);
                }}
              >
                {t("btnConfirmConfig")}
              </button>
              <button
                className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 transition hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                onClick={() => {
                  setImportDialogIsOpen(false);
                }}
              >
                {t("btnCancel")}
              </button>
            </div>
          </DialogPanel>
        </Dialog>
      </PopupTransition>

      <PopupTransition show={importFailedDialogIsOpen}>
        <Dialog
          as="div"
          className="fixed left-1/2 top-1/2 z-20 min-w-80 -translate-x-1/2 -translate-y-1/2"
          onClose={() => {
            setImportFailedDialogIsOpen(false);
          }}
        >
          <DialogPanel className="w-full min-w-[20rem] max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all dark:bg-slate-900">
            <DialogTitle
              as="h3"
              className="text-lg font-medium leading-6 text-gray-900 dark:text-white"
            >
              {t("warningInvalid")}
            </DialogTitle>
            <div className="mt-2">
              <p className="whitespace-pre-wrap text-sm text-gray-500 dark:text-gray-400">
                {importFailedMessage}
              </p>
            </div>
            <div className="mt-4">
              <button
                className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 transition hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                onClick={() => {
                  setImportFailedDialogIsOpen(false);
                }}
              >
                {t("iGotIt")}
              </button>
            </div>
          </DialogPanel>
        </Dialog>
      </PopupTransition>
    </>
  );
}
