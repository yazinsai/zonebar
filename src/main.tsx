import React from "react";
import ReactDOM from "react-dom/client";
import { getCurrentWindow } from "@tauri-apps/api/window";
import App from "./App";
import { BarApp } from "./BarApp";
import "./App.css";

const label = getCurrentWindow().label;
if (label === "bar") {
  document.body.classList.add("bar-window");
}

const Component = label === "bar" ? BarApp : App;

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Component />
  </React.StrictMode>,
);
