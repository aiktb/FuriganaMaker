import "@/assets/style.css";
import { initI18n } from "@/commons/i18n";

import React from "react";
import ReactDOM from "react-dom/client";
import Root from "./root";

await initI18n("popup");

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
);
