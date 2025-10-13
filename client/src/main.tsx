import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { MyContextProvider } from "./context/myContext"; // only this provider
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <MyContextProvider>
      <App />
    </MyContextProvider>
  </React.StrictMode>
);
