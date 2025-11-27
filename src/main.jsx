import { createRoot } from "react-dom/client";
import React from "react";
import "./css/index.css";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./js_files/i18n";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
