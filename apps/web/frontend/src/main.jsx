import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { registerServiceWorker } from "./push.js";
import "./styles.css";

createRoot(document.getElementById("root")).render(<App />);
registerServiceWorker();
