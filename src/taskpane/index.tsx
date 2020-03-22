import "office-ui-fabric-react/dist/css/fabric.min.css";
import App from "./components/App";
import { Provider } from 'react-redux';
import { createStore } from 'redux'
import rootReducer from './reducers'
import { AppContainer } from "react-hot-loader";
import { initializeIcons } from "office-ui-fabric-react/lib/Icons";
import * as serviceWorker from './serviceWorker';
import * as React from "react";
import * as ReactDOM from "react-dom";
/* global AppCpntainer, Component, document, Office, module, require */

initializeIcons();

let isOfficeInitialized = false;

const title = "Contoso Task Pane Add-in";

const store = createStore(rootReducer)

const render = Component => {
  ReactDOM.render(
    <Provider store={store}>
      <AppContainer>
      <Component title={title} isOfficeInitialized={isOfficeInitialized} />
    </AppContainer>
    </Provider>,
    document.getElementById("container")
  );
};

/* Render application after Office initializes */
Office.initialize = () => {
  isOfficeInitialized = true;
  render(App);
};

/* Initial render showing a progress bar */
render(App);

if ((module as any).hot) {
  (module as any).hot.accept("./components/App", () => {
    const NextApp = require("./components/App").default;
    render(NextApp);
  });
}
serviceWorker.unregister();