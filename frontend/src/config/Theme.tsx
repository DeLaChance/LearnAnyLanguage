import React from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import {
    createMuiTheme,
    makeStyles,
    createStyles,
    Theme as AugmentedTheme,
    ThemeProvider,
} from '@material-ui/core/styles';
import { orange, purple, indigo, lightBlue } from '@material-ui/core/colors';

declare module '@material-ui/core/styles/createMuiTheme' {
    
    interface Theme {
        status: {
            danger: string;
        };
    }

    // allow configuration using `createMuiTheme`
    interface ThemeOptions {
        status?: {
            danger?: string;
        };
    }
}

const useStyles = makeStyles((theme: AugmentedTheme) =>
    createStyles({
        root: {
            color: theme.status.danger,
            '&$checked': {
                color: theme.status.danger,
            },
        },
        checked: {

        }
    }),
);

export const theme = createMuiTheme({
    palette: {
        primary: {
            main: '#3c3c3c',
            contrastText: '#fff',
        },
        secondary: {
            main: '#f44336',     
            contrastText: '#fff',       
        },       
        error: {
            main: '#BD0043',
            contrastText: '#fff',
        },
        divider: '#D7D6D5',         
        contrastThreshold: 10,
        tonalOffset: 0.2,

        type: 'dark'
    },
    
});
