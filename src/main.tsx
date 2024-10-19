// #region Imports
import "./style.css";
import React from "react";
import ReactDOM from "react-dom/client";
import ReactGA from "react-ga4";
import App from "./App.tsx";
import { Provider } from 'react-redux';
import store from 'Redux/store.ts';

import AuthProvider from "react-auth-kit";
import createStore from 'react-auth-kit/createStore';
// #endregion

// ReactGA.initialize("G-8CMRRG2KNH");

const authStore = createStore({
  authName: '_auth',
  authType: 'cookie',
  cookieDomain: window.location.hostname,
  cookieSecure: window.location.protocol === 'https:',
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider store={authStore}>
      <Provider store={store}>
        <App />
      </Provider>
    </AuthProvider>
  </React.StrictMode>,
);