import { Suspense } from "react";

import { ExtStorage, type SelectorRule } from "@/commons/constants";

import { Page } from "../components/Page";
import RulePage from "../components/RulePage";

export default function RuleEditor() {
  async function initializeRules() {
    const rules = (await storage.getItem(`local:${ExtStorage.SelectorRules}`)) as SelectorRule[];
    return rules;
  }
  return (
    <Page title="Rule editor" icon="i-tabler-list-details">
      <Suspense fallback={<div className="min-h-screen" />}>
        <RulePage rulesPromise={initializeRules()} />
      </Suspense>
    </Page>
  );
}
