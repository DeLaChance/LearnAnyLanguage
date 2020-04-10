import { ListItem, ListItemIcon, ListItemText } from "@material-ui/core";
import React from "react";
import { MenuItemConfiguration } from "../domain/MenuItemConfiguration";
import { RouteComponentProps, withRouter } from "react-router-dom";

type Props = {
    configuration: MenuItemConfiguration
    onClick: (event: any) => void
};

type State = {
};

class MenuItem extends React.Component<Props & RouteComponentProps<any>, State> {
  
    constructor(props: Props & RouteComponentProps<any>) {
        super(props);
    }

    render() {        
        return (
            <ListItem button key={this.props.configuration.name} onClick={(e) => this.handleClick(e)}>
                <ListItemIcon>
                    {this.props.configuration.icon}
                </ListItemIcon>
                <ListItemText primary={this.props.configuration.name} />                    
            </ListItem>
        );    
    }

    handleClick(event: any): void {
        this.props.history.push(this.props.configuration.route);
        this.props.onClick(event);
    }
}

const MenuItemWithRouter = withRouter(MenuItem);
export default MenuItemWithRouter;