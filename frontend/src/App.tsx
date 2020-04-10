import React from 'react';
import LanguagePage from './languages/LanguagePage';
import AppMenuBar from './menu/AppMenuBar';

export default class App extends React.Component {
    render() {
        return (
            <>
                <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
                <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
                <div>
                    <AppMenuBar />
                    <LanguagePage iso2Codes={['nl', 'en', 'fr', 'de', 'zh', 'hi', 'ar']} />
                </div>
            </>
        );
    }
}