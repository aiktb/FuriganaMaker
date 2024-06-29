import "@/assets/style.css";
import "@/commons/i18n";

import React from "react";
import ReactDOM from "react-dom/client";
import Root from "./root";

// Nothing special here
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
);
