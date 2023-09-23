import * as React from "react";
import * as ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.scss";
import "config/configureMobX.ts";
import "regenerator-runtime";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

if (module.hot) {
  module.hot.accept();
}
