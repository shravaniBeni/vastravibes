import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import MyState from "./context/myState"; // make sure path is correct

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <MyState>
      <App />
    </MyState>
  </React.StrictMode>
);
