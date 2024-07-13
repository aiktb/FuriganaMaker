import { Suspense } from "react";

import { customRules } from "@/commons/utils";

import { Page } from "../components/Page";
import RulePage from "../components/RulePage";

export default function RuleEditor() {
  return (
    <Page title="Rule editor" icon="i-tabler-list-details">
      <Suspense fallback={<div className="min-h-screen" />}>
        <RulePage rulesPromise={customRules.getValue()} />
      </Suspense>
    </Page>
  );
}
