import { CssBaseline, MuiThemeProvider } from '@material-ui/core';
import React, { useState, useEffect } from 'react';
import {
    BrowserRouter as Router,
    Route, Switch
} from "react-router-dom";
import ErrorMessageSnackbar from './components/ErrorMessageSnackbar';
import { theme } from './config/Theme';
import LanguagePage from './languages/LanguagePage';
import ListsPage from './lists/ListsPage';
import PracticeListPage from './lists/PracticeListPage';
import AppMenuBar from './menu/AppMenuBar';
import ActiveRunPage from './runs/ActiveRunPage';
import RunPage from './runs/RunPage';
import RunsPage from './runs/RunsPage';
import StartPracticeRunPage from './runs/StartPracticeRunPage';
import backendClient from './clients/BackendHttpClient';

export default function App() {
    
    const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>();

    // Similar to componentDidMount and componentDidUpdate:
    useEffect(() => {
        backendClient.fetchLanguages()
            .catch(error => {
                setSnackbarOpen(true);
                setErrorMessage("The LearnAnyLanguage server is down.");
            });
    }, []);

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

            <ErrorMessageSnackbar open={snackbarOpen} errorMessage={errorMessage || ""} close={() => setSnackbarOpen(false)}/>                
        </MuiThemeProvider>
    );
    
}