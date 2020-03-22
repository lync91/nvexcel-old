import * as React from 'react';
import { CommandBar, ICommandBarItemProps } from 'office-ui-fabric-react/lib/CommandBar';
// import { IButtonProps } from 'office-ui-fabric-react/lib/Button';

// const overflowProps: IButtonProps = { ariaLabel: 'More commands' };

export default class CommandBarMain extends React.Component<{view: () => boolean | void}> {
    constructor(props, context) {
        super(props, context);
        this.state = {};
      }
    _items: ICommandBarItemProps[] = [
        {
          key: 'newItem',
          text: 'Menu',
          cacheKey: 'myCacheKey', // changing this key will invalidate this item's cache
          iconProps: { iconName: 'GlobalNavButton' },
          onClick: () => this.props.view()
        },
      ];
      
      _overflowItems: ICommandBarItemProps[] = [
        { key: 'move', text: 'Move to...', onClick: () => console.log('Move to'), iconProps: { iconName: 'MoveToFolder' } },
        { key: 'copy', text: 'Copy to...', onClick: () => console.log('Copy to'), iconProps: { iconName: 'Copy' } },
        { key: 'rename', text: 'Rename...', onClick: () => console.log('Rename'), iconProps: { iconName: 'Edit' } }
      ];
      
      _farItems: ICommandBarItemProps[] = [
        {
          key: 'tile',
          text: 'Grid view',
          // This needs an ariaLabel since it's icon-only
          ariaLabel: 'Grid view',
          iconOnly: true,
          iconProps: { iconName: 'Tiles' },
          onClick: () => console.log('Tiles')
        },
        {
          key: 'info',
          text: 'Info',
          // This needs an ariaLabel since it's icon-only
          ariaLabel: 'Info',
          iconOnly: true,
          iconProps: { iconName: 'Info' },
          onClick: () => console.log('Info')
        }
      ];
  render() {
    return (
        <div>
          <CommandBar
            items={this._items}
            // overflowItems={this._overflowItems}
            // overflowButtonProps={overflowProps}
            farItems={this._farItems}
            ariaLabel="Use left and right arrow keys to navigate between commands"
          />
        </div>
      );
  }
  
};


