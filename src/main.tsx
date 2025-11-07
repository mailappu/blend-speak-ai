import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Initialize theme before rendering - default to light mode
const theme = localStorage.getItem("theme") || "light";
document.documentElement.classList.toggle("light", theme === "light");

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
