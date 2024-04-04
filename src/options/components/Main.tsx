import { Dialog, Transition } from "@headlessui/react";
import { Icon } from "@iconify/react";
import { saveAs } from "file-saver";
import { use, useEffect, useState } from "react";
import { z } from "zod";

import { Storage } from "@plasmohq/storage";

import { ExtensionStorage, type SelectorRule } from "~core/constants";

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
    const storage = new Storage({ area: "local" });
    storage.set(ExtensionStorage.SelectorRules, rules);
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

        const storage = new Storage({ area: "local" });
        await storage.set(ExtensionStorage.SelectorRules, mergedRules);
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

  return (
    <>
      <main className="flex grow flex-col justify-start">
        <p className="mx-auto mb-2 max-w-full whitespace-normal text-pretty border-b border-gray-200 p-4 text-center text-base font-bold dark:border-slate-800">
          Feel free to share your custom rules in the{" "}
          <a
            href="https://github.com/aiktb/FuriganaMaker/discussions"
            className="text-sky-500 underline transition hover:text-sky-700"
            target="_blank"
            rel="noreferrer noopener"
          >
            Github Discussions
          </a>
          !
        </p>
        <div className="mx-auto my-2 flex max-w-5xl flex-col items-center justify-between gap-1.5 px-5 text-base font-bold text-sky-500 sm:px-6 md:flex-row md:justify-between lg:max-w-7xl lg:px-8">
          <button
            className="flex items-center gap-x-1.5 rounded-md border border-gray-200 px-1.5 py-0.5 shadow-md transition-[background-color] hover:bg-transparent/10 dark:border-slate-800 dark:hover:bg-transparent/20"
            onClick={() => {
              setCreateRuleDialogIsOpen(true);
            }}
          >
            <Icon
              className="size-5"
              aria-hidden="true"
              icon="material-symbols:add-to-photos-outline-rounded"
            />
            Add New Rule
          </button>
          <div className="flex gap-x-1.5">
            <button
              className={`${
                rules.length === 0 ? "cursor-not-allowed" : ""
              } flex items-center gap-x-1.5 rounded-md border border-gray-200 px-1.5 py-0.5 shadow-md transition-[background-color] hover:bg-transparent/10 dark:border-slate-800 dark:hover:bg-transparent/20`}
              onClick={exportConfig}
            >
              <Icon className="size-5" aria-hidden="true" icon="pajamas:export" />
              Export Config
            </button>
            <button
              className="flex cursor-pointer items-center gap-x-1.5 rounded-md border border-gray-200 px-1.5 py-0.5 shadow-md transition-[background-color] hover:bg-transparent/10 dark:border-slate-800 dark:hover:bg-transparent/20"
              onClick={() => {
                setImportDialogIsOpen(true);
              }}
            >
              <Icon className="size-5" aria-hidden="true" icon="pajamas:import" />
              Import Config
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
          <Dialog.Panel className="w-full min-w-[28rem] max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all dark:bg-slate-900">
            <RuleEditor mode="create" onChange={createNewRule} />
          </Dialog.Panel>
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
          <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all dark:bg-slate-900">
            <Dialog.Title
              as="h3"
              className="text-lg font-medium leading-6 text-gray-900 dark:text-white"
            >
              Warning!
            </Dialog.Title>
            <div className="mt-2">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                This will overwrite the existing configuration file and this action is not undoable,
                sure about this?
              </p>
            </div>
            <div className="mt-4 flex gap-2.5">
              <button
                className="inline-flex justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-slate-900 transition hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 dark:bg-red-800 dark:text-slate-200 dark:hover:bg-red-900"
                onClick={() => {
                  importConfig();
                  setImportDialogIsOpen(false);
                }}
              >
                Import
              </button>
              <button
                className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 transition hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                onClick={() => {
                  setImportDialogIsOpen(false);
                }}
              >
                Cancel
              </button>
            </div>
          </Dialog.Panel>
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
          <Dialog.Panel className="w-full min-w-[20rem] max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all dark:bg-slate-900">
            <Dialog.Title
              as="h3"
              className="text-lg font-medium leading-6 text-gray-900 dark:text-white"
            >
              Invalid JSON format!
            </Dialog.Title>
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
                I Got It!
              </button>
            </div>
          </Dialog.Panel>
        </Dialog>
      </PopupTransition>
    </>
  );
}
