import React from 'react';
import LanguagePage from './languages/LanguagePage';
import AppMenuBar from './menu/AppMenuBar';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
  } from "react-router-dom";
import { Theme } from './config/Theme';
import { MuiThemeProvider, CssBaseline } from '@material-ui/core';

export default class App extends React.Component {
    render() {
        return (
            <MuiThemeProvider theme={Theme}>
                <CssBaseline />
                <Router>
                    <AppMenuBar />

                    <Switch>
                        <Route path="/languages">
                            <LanguagePage iso2Codes={['nl', 'en', 'fr', 'de', 'zh', 'hi', 'ar']} />
                        </Route>
                        <Route path="/">                        
                        </Route>                    
                    </Switch>
                </Router>
            </MuiThemeProvider>
        );
    }
}