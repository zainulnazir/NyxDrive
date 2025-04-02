import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./App.css";

// Add Tauri API to window for better type support
declare global {
  interface Window {
    __TAURI__?: {
      invoke: typeof import("@tauri-apps/api/core").invoke;
    };
  }
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);