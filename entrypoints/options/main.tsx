import "@/assets/style.css";
import { initI18n } from "@/commons/i18n";

await initI18n("options");
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createHashRouter } from "react-router-dom";

import ErrorPage from "./components/ErrorPage";
import Root from "./root";
import Changelog from "./routes/Changelog";
import RuleEditor from "./routes/RuleEditor";
import Settings from "./routes/Settings";

const router = createHashRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      { path: "/", element: <Settings /> },
      { path: "/rules", element: <RuleEditor /> },
      { path: "/changelog", element: <Changelog /> },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
