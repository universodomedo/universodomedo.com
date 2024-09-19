// #region Imports
import "./style.css";
import React from "react";
import ReactDOM from "react-dom/client";
import ReactGA from "react-ga4";
import App from "./App.tsx";
import { Provider } from 'react-redux';
import store from 'Redux/store.ts';
// #endregion

// ReactGA.initialize("G-8CMRRG2KNH");

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
)