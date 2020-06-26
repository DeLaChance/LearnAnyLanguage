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
                    <Route key="1" path="/languages">
                        <LanguagePage />
                    </Route>
                    <Route key="2" path="/lists/:practiceListId">
                        <PracticeListPage />
                    </Route>
                    <Route key="3" path="/lists">
                        <ListsPage />
                    </Route>
                    <Route key="4" path="/runs/:_practiceListId/start">
                        <StartPracticeRunPage />
                    </Route>                            
                    <Route key="5" path="/runs/active/:runId">
                        <ActiveRunPage />
                    </Route>
                    <Route key="6" path="/runs/lists/:listId">
                        <RunsPage />
                    </Route>                         
                    <Route key="6" path="/runs/:runId">
                        <RunPage />
                    </Route>
                    <Route key="7" path="/runs">
                        <RunsPage />
                    </Route>                        
                    <Route key="8" path="/">                        
                    </Route>                    
                </Switch>
            </Router>

            <ErrorMessageSnackbar open={snackbarOpen} errorMessage={errorMessage || ""} close={() => setSnackbarOpen(false)}/>                
        </MuiThemeProvider>
    );
    
}