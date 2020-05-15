import React from 'react';
import LanguagePage from './languages/LanguagePage';
import AppMenuBar from './menu/AppMenuBar';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
  } from "react-router-dom";
import { theme } from './config/Theme';
import { MuiThemeProvider, CssBaseline } from '@material-ui/core';
import ListsPage from './lists/ListsPage';
import PracticeListPage from './lists/PracticeListPage';
import StartPracticeRunPage from './runs/StartPracticeRunPage';

export default class App extends React.Component {
    render() {
        return (
            <MuiThemeProvider theme={theme}>
                <CssBaseline />
                <Router>
                    <AppMenuBar />

                    <Switch>
                        <Route path="/languages">
                            <LanguagePage />
                        </Route>
                        <Route path="/lists/:practiceListId">
                            <PracticeListPage />
                        </Route>
                        <Route path="/lists">
                            <ListsPage />
                        </Route>
                        <Route path="/runs/:_practiceListId/start">
                            <StartPracticeRunPage />
                        </Route>                            
                        <Route path="/">                        
                        </Route>                    
                    </Switch>
                </Router>
            </MuiThemeProvider>
        );
    }
}