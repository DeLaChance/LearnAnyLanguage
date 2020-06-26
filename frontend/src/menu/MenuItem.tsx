import { ListItem, ListItemIcon, ListItemText } from "@material-ui/core";
import React from "react";
import { useHistory } from "react-router-dom";
import { MenuItemConfiguration } from "../domain/MenuItemConfiguration";

type Props = {
    configuration: MenuItemConfiguration
    onClick: (event: any) => void
};

export default function MenuItem(props: Props) {
  
    let history = useHistory();
    const redirect = (event: any, route: string) => {
        history.push(props.configuration.route);
        props.onClick(event);
    }

    return (
        <ListItem button key={props.configuration.name} onClick={(e) => redirect(e, props.configuration.route)}>
            <ListItemIcon>
                {props.configuration.icon}
            </ListItemIcon>
            <ListItemText primary={props.configuration.name} />                    
        </ListItem>
    );    
}
