import changelog from "@/CHANGELOG.md?raw";
import Markdown from "react-markdown";

import { Page } from "../components/Page";

export default function Changelog() {
  return (
    <Page title="Changelog" icon="i-tabler-history">
      <Markdown className="prose prose-slate dark:prose-invert">{changelog}</Markdown>
    </Page>
  );
}
