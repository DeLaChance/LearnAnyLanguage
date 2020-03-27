import React from "react";
import { makeStyles, SwipeableDrawer, List, ListItem, ListItemText, ListItemIcon } from "@material-ui/core";
import clsx from 'clsx';
import LanguageIcon from '@material-ui/icons/Language';
import SchoolIcon from '@material-ui/icons/School';
import ListIcon from '@material-ui/icons/List'


type Props = {
    drawerOpen: boolean;
    toggleDrawer: ((event: any) => void);
};

type State = {
};

interface MenuItemConfiguration {

    name: string;
    icon: React.ReactElement;
}

export class AppMenuDrawer extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
    }

    render() {
        return (
            <SwipeableDrawer anchor="left" open={this.props.drawerOpen} 
                onClose={(e) => this.props.toggleDrawer(e)}
                onOpen={(e) => this.props.toggleDrawer(e)}
            >
                {this.generateMenuItemList()}
          </SwipeableDrawer>
        );
    }
    
    private useStyles(): any {
        return makeStyles({
            list: {
              width: 250,
            },
            fullList: {
              width: 'auto',
            },
        });
    }

    private generateMenuItemList(): React.ReactElement {
        let menuItems: MenuItemConfiguration[] = [
            {
                "name": "Lists",
                "icon": (
                    <ListIcon />
                )
            },
            {
                "name": "Practice Runs",
                "icon": (
                    <SchoolIcon />
                )
            },
            {
                "name": "Languages",
                "icon": (
                    <LanguageIcon />
                )
            }
        ];

        let styles: any = this.useStyles();

        return (
            <div className={clsx(styles.list)}
                role="presentation"
                onClick={(e) => this.props.toggleDrawer(e)}
                onKeyDown={(e) => this.props.toggleDrawer(e)}
            >
                <List>
                    {menuItems.map(configuration => this.generateMenuItem(configuration)) }
                </List>
            </div>
        );
    }

    private generateMenuItem(menuItemConfiguration: MenuItemConfiguration): React.ReactElement {
        return (
            <ListItem button key={menuItemConfiguration.name}>
                <ListItemIcon>
                    {menuItemConfiguration.icon}
                </ListItemIcon>
                <ListItemText primary={menuItemConfiguration.name} />                    
            </ListItem>
        );
    }
}

