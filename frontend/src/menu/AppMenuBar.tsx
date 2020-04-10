import React from "react";
import { Typography, Toolbar, IconButton, AppBar } from "@material-ui/core";
import MenuIcon from '@material-ui/icons/Menu';
import { makeStyles } from '@material-ui/core/styles';
import { AppMenuDrawer } from "./AppMenuDrawer";

type Props = {
};

type State = {
    drawerOpen: boolean
};

export default class AppMenuBar extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);

        this.state = {
            drawerOpen: false
        };
    }

    useStyles(): any {
        return makeStyles(theme => ({
            root: {
              flexGrow: 1,
            },
            menuButton: {
              marginRight: theme.spacing(2),
            },
            title: {
              flexGrow: 1,
            },
        }));    
    } 

    render() {
        const classes = this.useStyles();

        return (
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
                        <MenuIcon onClick={(e) => this.toggleDrawer(e)}/>
                    </IconButton>
                    <Typography variant="h6" className={classes.title}>
                    LearnAnyLanguage
                    </Typography>
                </Toolbar>
                <AppMenuDrawer drawerOpen={this.state.drawerOpen} toggleDrawer={(e) => this.toggleDrawer(e)} />
            </AppBar>
        );
    }

    private toggleDrawer(event: any) {
        if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }

        this.setState({ 
            drawerOpen: !this.state.drawerOpen 
        });
    };

}