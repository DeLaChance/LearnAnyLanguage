import { CssBaseline, MuiThemeProvider } from '@material-ui/core';
import React from 'react';
import {
    BrowserRouter as Router,

    Route, Switch
} from "react-router-dom";
import { theme } from './config/Theme';
import LanguagePage from './languages/LanguagePage';
import ListsPage from './lists/ListsPage';
import PracticeListPage from './lists/PracticeListPage';
import AppMenuBar from './menu/AppMenuBar';
import ActiveRunPage from './runs/ActiveRunPage';
import RunPage from './runs/RunPage';
import RunsPage from './runs/RunsPage';
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
                        <Route path="/runs/active/:runId">
                            <ActiveRunPage />
                        </Route>
                        <Route path="/runs/:runId">
                            <RunPage />
                        </Route>        
                        <Route path="/runs">
                            <RunsPage />
                        </Route>                        
                        <Route path="/">                        
                        </Route>                    
                    </Switch>
                </Router>
            </MuiThemeProvider>
        );
    }
}