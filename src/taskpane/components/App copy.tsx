import * as React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  // Redirect,
  // useHistory,
  // useLocation
} from "react-router-dom";
import { Button, ButtonType } from "office-ui-fabric-react";
import Header from "./Header";
import HeroList, { HeroListItem } from "./HeroList";

import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { Panel, PanelType } from 'office-ui-fabric-react/lib/Panel';
// import { Dropdown, IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';
// import { Link } from 'office-ui-fabric-react/lib/Link';
// import { useConstCallback } from '@uifabric/react-hooks';

// import Progress from "./Progress";
/* global Button, console, Excel, Header, HeroList, HeroListItem, Progress */

export interface AppProps {
  title: string;
  isOfficeInitialized: boolean;
}

export interface AppState {
  listItems: HeroListItem[];
  isOpen: boolean;
}

export default class App extends React.Component<AppProps, AppState> {
  isOpen: boolean;
  constructor(props, context) {
    super(props, context);
    this.state = {
      listItems: [],
      isOpen: false
    };
  }

  // const { description, panelType } = props;
  // const [isOpen, setIsOpen] = React.useState<boolean>(false);

  // const openPanel = useConstCallback(() => setIsOpen(true));
  // const dismissPanel = useConstCallback(() => setIsOpen(false));

  // const a = 'aeiou'.indexOf(description[0]) === -1 ? 'a' : 'an'; // grammar...

  openPanel = () => this.setState({ isOpen: true });

  dismissPanel = () => this.setState({ isOpen: false });

  componentDidMount() {
    this.setState({
      listItems: [
        {
          icon: "Ribbon",
          primaryText: "Achieve more with Office integration"
        },
        {
          icon: "Unlock",
          primaryText: "Unlock features and functionality"
        },
        {
          icon: "Design",
          primaryText: "Create and visualize like a pro"
        }
      ],
    });
  }

  click = async () => {
    try {
      await Excel.run(async context => {
        /**
         * Insert your Excel code here
         */
        const range = context.workbook.getSelectedRange();

        // Read the range address
        range.load("address");

        // Update the fill color
        range.format.fill.color = "yellow";

        await context.sync();
        console.log(`The range address was ${range.address}.`);
      });
    } catch (error) {
      console.error(error);
    }
  };

  render() {
    const { } = this.props;

    // if (!isOfficeInitialized) {
    //   return (
    //     <Progress title={title} logo="assets/logo-filled.png" message="Please sideload your addin to see app body." />
    //   );
    // }

    return (
      <Router>
        <div className="ms-welcome">
          <Link to="/login">Public Page</Link>
          <DefaultButton text="Open panel" onClick={this.openPanel} />
          <Panel
            isOpen={this.state.isOpen}
            onDismiss={this.dismissPanel}
            type={PanelType.smallFluid}
            // customWidth={PanelType.smallFluid}
            closeButtonAriaLabel="Close"
            headerText="Sample panel"
          >
      </Panel>
          <Header logo="assets/logo-filled.png" title={this.props.title} message="Welcome" />
          <Switch>
            <Route path="/">
              <HeroList message="Discover what Office Add-ins can do for you today!" items={this.state.listItems}>
                <p className="ms-font-l">
                  Modify the source files, then click <b>Run Hello</b>.
            </p>
                <Button
                  className="ms-welcome__action"
                  buttonType={ButtonType.hero}
                  iconProps={{ iconName: "ChevronRight" }}
                  onClick={this.click}
                >
                  Run
            </Button>
              </HeroList>
            </Route>
            <Route path="/login">
              Hello
            </Route>
          </Switch>

        </div>
      </Router>

    );
  }
}
