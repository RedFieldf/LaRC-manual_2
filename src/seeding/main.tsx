import { createRoot } from "react-dom/client";
import "./firebase";
import "../index.css";
import { App } from "./App";

const root = createRoot(document.getElementById("root")!);
root.render(<App />);
