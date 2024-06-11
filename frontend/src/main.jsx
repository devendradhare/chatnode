import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { AuthContextProvider } from "./context/authContext";
import { ContactContextProvider } from "./context/contactContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthContextProvider>
        <ContactContextProvider>
          <App />
        </ContactContextProvider>
      </AuthContextProvider>
    </BrowserRouter>
  </React.StrictMode>
);
