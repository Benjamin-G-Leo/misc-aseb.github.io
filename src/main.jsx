import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// Self-hosted variable fonts (no external requests)
import "@fontsource-variable/inter";
import "@fontsource-variable/archivo/wdth.css";
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
