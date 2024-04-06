import { Disclosure } from "@headlessui/react";
import { useState } from "react";

import type { SelectorRule } from "~core/constants";

type RuleEditorProps = UpdateProps | CreateProps;

interface UpdateProps {
  rule: SelectorRule;
  mode: "update";
  onChange: (rule: SelectorRule) => void;
}

interface CreateProps {
  rule?: undefined;
  mode: "create";
  onChange: (rule: SelectorRule) => void;
}

export default function RuleEditor({ rule, mode, onChange }: RuleEditorProps) {
  const [domain, setDomain] = useState(mode === "update" ? rule.domain : "");
  const [selector, setSelector] = useState(mode === "update" ? rule.selector : "");
  const active = mode === "update" ? rule.active : true;

  function submit(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    onChange({ active, domain, selector });
  }

  return (
    <div className="mx-auto w-full max-w-md rounded-2xl p-2">
      <Disclosure>
        {({ open }) => (
          <>
            <Disclosure.Button className="flex w-full items-center justify-between rounded-lg bg-sky-100 px-4 py-2 text-left text-sm font-medium text-sky-900 hover:bg-sky-200 focus:outline-none focus-visible:ring focus-visible:ring-sky-500/75 dark:bg-sky-900 dark:text-sky-300 dark:hover:bg-sky-700">
              <span>What is selector field?</span>
              <span
                className={`${
                  open ? "rotate-180 transform" : ""
                } size-4 text-sky-500 -rotate-90 i-[material-symbols--arrow-back-ios-new-rounded]`}
                aria-hidden="true"
              />
            </Disclosure.Button>
            <Disclosure.Panel className="px-4 pb-2 pt-4 text-sm">
              <section>
                <ul className="list-disc marker:text-black dark:marker:text-white">
                  <li className="my-2">
                    The{" "}
                    <code className="font-mono text-sm font-bold text-slate-900 before:content-['`'] after:content-['`'] dark:text-slate-200">
                      selector
                    </code>{" "}
                    field uses the{" "}
                    <a
                      className="cursor-pointer border-b border-sky-500 font-bold text-slate-900 hover:border-b-2 dark:text-slate-200"
                      href="https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_selectors"
                    >
                      CSS selector
                    </a>{" "}
                    syntax to specify the element to be tagged on the page.
                  </li>
                  <li className="my-2">
                    If you are not familiar with the CSS selector syntax, please do not modify this
                    field, as this may invalidate the extension.
                  </li>
                  <li className="my-2">
                    Most sites can specify this field as{" "}
                    <code className="font-mono text-sm font-bold text-slate-900 before:content-['`'] after:content-['`'] dark:text-slate-200">
                      body
                    </code>
                    , which adds Furigana to Japanese text on most pages.
                  </li>
                  <li className="my-2">
                    The{" "}
                    <code className="font-mono text-sm font-bold text-slate-900 before:content-['`'] after:content-['`'] dark:text-slate-200">
                      selector
                    </code>{" "}
                    fields are separated by comma, and selectors corresponding to the same{" "}
                    <code className="font-mono text-sm font-bold text-slate-900 before:content-['`'] after:content-['`'] dark:text-slate-200">
                      domain
                    </code>{" "}
                    will be merged directly.
                  </li>
                </ul>
              </section>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>

      <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="text-center text-2xl font-bold leading-9 tracking-tight text-gray-900 dark:text-white">
            <span className="capitalize"> {mode} </span> your custom rule
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6">
            <div>
              <label
                htmlFor="domain"
                className="block text-sm font-medium leading-6 text-gray-900 dark:text-slate-200"
              >
                Domain
              </label>
              <div className="mt-2">
                <input
                  id="domain"
                  name="domain"
                  disabled={mode === "update"}
                  required
                  placeholder="example.com"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 disabled:cursor-not-allowed dark:bg-slate-900 dark:text-white dark:ring-gray-700 dark:focus:ring-sky-600 sm:text-sm sm:leading-6"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="selector"
                  className="block text-sm font-medium leading-6 text-gray-900 dark:text-slate-200"
                >
                  Selector
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="selector"
                  name="selector"
                  required
                  placeholder="body"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 dark:bg-slate-900 dark:text-white dark:ring-gray-700 dark:focus:ring-sky-600 sm:text-sm sm:leading-6"
                  value={selector}
                  onChange={(e) => setSelector(e.target.value)}
                />
              </div>
            </div>

            <div>
              <button
                className="flex w-full justify-center rounded-md bg-sky-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-sky-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 disabled:cursor-not-allowed"
                disabled={!(domain && selector)}
                onClick={submit}
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
