import React, { Suspense } from "react";
import {
  Router,
  Switch,
  Route,
  // Link
} from "react-router-dom";
import history from './history';
import CommandBarMain from "./CommandBarMain"
import NavMenu from "./NavMenu";
import { Panel, PanelType } from 'office-ui-fabric-react/lib/Panel';
// import CharConvert from './CharConvert';
const CharConvert = React.lazy(() => import('./CharConvert'))
import PageFormat from "./PageFormat";
export interface AppProps {
  title: string;
  isOfficeInitialized: boolean;
}

export interface AppState {
  isOpen: boolean;
}

export default class App extends React.Component<AppProps, AppState> {

  isOpen: boolean;
  constructor(props, context) {
    super(props, context);
    this.state = {
      isOpen: false
    };
    this.openPanel = this.openPanel.bind(this);
    this.dismissPanel = this.dismissPanel.bind(this);
  }
  openPanel = () => this.setState({ isOpen: true });
  dismissPanel = () => this.setState({ isOpen: false });
  render() {
    const { } = this.props;
    return (
      <Router history={ history }>
          <Panel
            isOpen={this.state.isOpen}
            onDismiss={this.dismissPanel}
            type={PanelType.smallFluid}
            // customWidth={PanelType.smallFluid}
            closeButtonAriaLabel="Close"
            headerText="Menu"
          >
            <NavMenu dismissPanel={this.dismissPanel.bind(this)}></NavMenu>
      </Panel>
        <div>
          <CommandBarMain view={this.openPanel.bind(this)}></CommandBarMain>
          <Suspense fallback="">
          <Switch>
            <Route exact path="/">
              <Home />
            </Route>
            <Route path="/about">
              <About />
            </Route>
            <Route path="/dashboard">
              <Dashboard />
            </Route>
            <Route path="/charConvert">
              <CharConvert />
            </Route>
            <Route path="/pageFormat">
              <PageFormat />
            </Route>
          </Switch>
          </Suspense>
        </div>
      </Router>
    );
  }
}

function Home() {
  return (
    <div>
      <h2>Home</h2>
    </div>
  );
}

function About() {
  return (
    <div>
      <h2>About</h2>
    </div>
  );
}

function Dashboard() {
  return (
    <div>
      <h2>Dashboard</h2>
    </div>
  );
}
