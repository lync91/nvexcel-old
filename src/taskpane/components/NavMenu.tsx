import * as React from 'react';
import { Nav, INavLink } from 'office-ui-fabric-react/lib/Nav';
// import { useHistory } from "react-router-dom";
// import { withRouter } from 'react-router';
import { connect } from "react-redux";
import history from './history'

export interface AppProps {
  dismissPanel: () => boolean | void;
  selectedKey: string;
  dispatch: any
}

export interface AppState {
  selectedKey: string
}

class NavMenu extends React.Component<AppProps, AppState> {
  selectedKey: string;
  constructor(props, context) {
    super(props, context);
  }
  componentWillMount () {
    console.log(this.props);
  }
  _onLinkClick = async (ev?: React.MouseEvent<HTMLElement, MouseEvent>, item?: INavLink) => {
    console.log(item);
    console.log(ev);
    if (!item.links) {
      history.push('/' + item.key);
      this.props.dispatch({type: 'CHANGE_LOCATION', selectedKey: item.key})
      this.props.dismissPanel();
    }
  };
  render() {
    return (
      <Nav
        onLinkClick={this._onLinkClick}
        selectedKey={this.props.selectedKey}
        ariaLabel="Nav basic example"
      //   styles={{
      //     root: {
      //       width: 208,
      //       height: 350,
      //       boxSizing: 'border-box',
      //       border: '1px solid #eee',
      //       overflowY: 'auto'
      //     }
      //   }}
        groups={[
          {
            links: [
              {
                name: 'Dự toán',
                url: '',
                expandAriaLabel: 'Expand Home section',
                collapseAriaLabel: 'Collapse Home section',
                links: [
                  {
                    name: 'Activity',
                    url: '',
                    key: 'about',
                    target: '',
                    // onClick: () => {
                    //   // history.push('/about')
                    //   history.push("/about")
                    //   this.props.dismissPanel();
                    // }
                  },
                  {
                    name: 'MSN',
                    url: '',
                    key: 'key2',
                    target: '',
                    // onClick: () => {console.log('Clicked');
                    // }
                  }
                ],
                isExpanded: true
              },
              {
                name: 'Khối lượng',
                url: '',
                key: 'key3',
                isExpanded: true,
                target: ''
              },
              {
                name: 'Công cụ',
                url: '',
                expandAriaLabel: 'Expand Home section',
                collapseAriaLabel: 'Collapse Home section',
                links: [
                  {
                    name: 'Định dạng trang in',
                    url: '',
                    key: 'pageFormat',
                    target: '',
                  },
                  {
                    name: 'Chuyển mã tiếng Việt',
                    url: '',
                    key: 'charConvert',
                    target: '',
                    // onClick: () => {console.log('Clicked');
                    // }
                  }
                ],
                isExpanded: true
              },
              {
                name: 'Notebook',
                url: '',
                key: 'key5',
                disabled: true
              },
              {
                name: 'Communication and Media',
                url: '',
                key: 'key6',
                target: '_blank'
              },
              {
                name: 'News',
                url: '',
                icon: 'News',
                key: 'key7',
                target: '_blank'
              }
            ]
          }
        ]}
      />
    );
  }
};

// function _onLinkClick(item?: INavLink) {
//   if (item && item.name === 'News') {
//     alert('News link clicked');
//   }
// }

// const mapDispatchToProps = dispatch => {
//   return {
//     changeLocation: (location) => dispatch()
//   }
// }
const mapStateToProps = (state) => {
  console.log(state);
  
  return {
    selectedKey: state.navMenu.selectedKey
  }
}

export default connect(mapStateToProps)(NavMenu)