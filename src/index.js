import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { store } from "./app/store";
import "./asset/style.css";
import { Provider } from "react-redux";
//import { StoreProvider } from "./contexts/storeProvider";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  
  <Provider store={store}>
    <App />
  </Provider>

);

reportWebVitals();
