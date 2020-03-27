import React from 'react';
import AppMenuBar from './menu/AppMenuBar';

export default class App extends React.Component {
    render() {
        return (
            <>
                <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
                <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
                <AppMenuBar />
            </>
        );
    }
}