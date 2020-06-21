import { createMuiTheme } from '@material-ui/core/styles';

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
