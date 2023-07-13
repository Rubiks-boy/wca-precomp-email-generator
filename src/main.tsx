import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { initializeAuth } from "./auth";
import "./index.css";

initializeAuth();

ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
