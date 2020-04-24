import React from "react";
import { Typography, Toolbar, IconButton, AppBar } from "@material-ui/core";
import MenuIcon from '@material-ui/icons/Menu';
import { makeStyles } from '@material-ui/core/styles';
import { AppMenuDrawer } from "./AppMenuDrawer";


export default function AppMenuBar() {

    const [drawerOpen, setDrawerOpen] = React.useState(false);

    const useStyles = makeStyles(theme => ({
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

    const toggleDrawer = (event: any) => {
        if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }

        setDrawerOpen(!drawerOpen);
    };
    
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
                        <MenuIcon onClick={(e) => toggleDrawer(e)}/>
                    </IconButton>
                    <Typography variant="h6" className={classes.title}>
                    LearnAnyLanguage
                    </Typography>
                </Toolbar>
                <AppMenuDrawer drawerOpen={drawerOpen} toggleDrawer={(e) => toggleDrawer(e)} />
            </AppBar>
        </div>
    );

}