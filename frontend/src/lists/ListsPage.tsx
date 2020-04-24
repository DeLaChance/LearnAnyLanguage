import React, { useEffect, useState } from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem, { ListItemProps } from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import { PracticeList } from '../domain/PracticeList';
import config from '../config/config.json';

export default function ListsPage() {

    // Hooks
    const [practiceLists, setPracticeLists] = useState<PracticeList[]>([]);

    // Similar to componentDidMount and componentDidUpdate:
    useEffect(() => {
        preparePracticeLists();
    }, []); 

    const preparePracticeLists = async function(): Promise<void> {

        let httpReponse = await fetch(config.backendBaseUrl + "lists");
        if (httpReponse.status == 200) {
            let responseJson = await httpReponse.json();

            let practiceLists: PracticeList[] = responseJson.map((languageJson: any) => 
                new PracticeList(languageJson.id, languageJson.name, languageJson.source, languageJson.target)
            );
            
            setPracticeLists(practiceLists);
            console.log(`Set practiceLists to ${practiceLists}`);

            return Promise.resolve();
        } else {
            return Promise.reject("Backend is down.");
        }
    };

    const useStyles = makeStyles((theme: Theme) =>
        createStyles({
            root: {
                flexWrap: 'wrap',
                backgroundColor: theme.palette.background.paper,
                margin: 'auto',
                width: 500,
                height: 80,
                display: 'flex',
            },
            list: {
                margin: 'auto'
            },

        }),
    );
  
    const classes = useStyles();

    const practiceListComponents = practiceLists.map(practiceList => {
        return (
            <>
                <ListItem button key={practiceList.id}>
                    <ListItemText primary={practiceList.name} />
                </ListItem>
            </>
        );
    });

    return (
        <div className={classes.root}>
            <List component="nav" className={classes.list}>
                {practiceListComponents}   
            </List>
        </div>
    );
}