import "@/assets/style.css";
import React from "react";
import ReactDOM from "react-dom/client";

import Root from "./root";

import "@/commons/i18n";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
);
