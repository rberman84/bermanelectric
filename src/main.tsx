import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

const helmetNonce = document.head?.dataset.cspNonce ?? window.__CSP_NONCE__;

createRoot(document.getElementById("root")!).render(<App helmetNonce={helmetNonce} />);
