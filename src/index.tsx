import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { Auth0Provider } from "@auth0/auth0-react";
import { BrowserRouter as Router } from "react-router-dom";
import reportWebVitals from "./reportWebVitals";
import { Provider } from "react-redux";
import { store } from "./app/store";

const clientId = process.env.REACT_APP_CLIENT_ID;
const domain =
  process.env.NODE_ENV === "development"
    ? process.env.DOMAIN
    : "falowo.eu.auth0.com";

ReactDOM.render(
  <Auth0Provider
    domain={domain!}
    clientId={clientId!}
    redirectUri={window.location.origin}
  >
    <React.StrictMode>
      <Provider store={store}>
        <Router>
          <App />
        </Router>
      </Provider>
    </React.StrictMode>
  </Auth0Provider>,
  document.getElementById("root"),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
