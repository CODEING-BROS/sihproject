import React from "react";
import ReactDOM from "react-dom/client";
import 'stream-chat-react/dist/css/v2/index.css';
import App from "./App";
import { Toaster } from "sonner";
import "./index.css";
// import "./quiz.css";


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Toaster position="top-right" richColors />
    <App />
  </React.StrictMode>
);
