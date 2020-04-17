import { List, makeStyles, SwipeableDrawer, ListItem } from "@material-ui/core";
import LanguageIcon from '@material-ui/icons/Language';
import ListIcon from '@material-ui/icons/List';
import SchoolIcon from '@material-ui/icons/School';
import clsx from 'clsx';
import React from "react";
import { MenuItemConfiguration } from "../domain/MenuItemConfiguration";
import MenuItemWithRouter from "./MenuItem";

type Props = {
    drawerOpen: boolean;
    toggleDrawer: ((event: any) => void);
};

type State = {
};

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
                "route": "/lists",
                "icon": (
                    <ListIcon />
                )
            },
            {
                "name": "Practice Runs",
                "route": "/runs",
                "icon": (
                    <SchoolIcon />
                )
            },
            {
                "name": "Languages",
                "route": "/languages",
                "icon": (
                    <LanguageIcon />
                )
            }
        ];

        let styles: any = this.useStyles();

        return (
            <div className={clsx(styles.list)}
                role="presentation"
                onKeyDown={(e) => this.props.toggleDrawer(e)}
            >
                <List>
                    {menuItems.map(configuration => this.generateMenuItemWithRouter(configuration))}                                        
                </List>
            </div>
        );
    }

    generateMenuItemWithRouter(configuration: MenuItemConfiguration): any {
        let menuItem: any = (
            <ListItem key={configuration.name}>
                <MenuItemWithRouter configuration={configuration} onClick={(e) => this.props.toggleDrawer(e)}></MenuItemWithRouter>                        
            </ListItem>            
        );
        return menuItem;
    }

}

