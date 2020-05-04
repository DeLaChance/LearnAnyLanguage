import React, { useEffect, useState, ReactElement } from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem, { ListItemProps } from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { useHistory } from "react-router-dom";
import { PracticeList } from '../domain/PracticeList';
import config from '../config/config.json';
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled';
import { IconButton, ListItemSecondaryAction } from '@material-ui/core';

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

            let practiceLists: PracticeList[] = responseJson.map((practiceListJson: any) => 
                PracticeList.from(practiceListJson)
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
                backgroundColor: theme.palette.background.paper,
            },
            list: {
                margin: 'auto'
            },
            listItem: {
            }
        }),
    );
  
    const classes = useStyles();
    
    let history = useHistory();
    const handleClick = (event: any, route: string) => {
        history.push(route);        
    }

    const createPracticeListItem = (practiceList: PracticeList): React.ReactElement => {
        let route: string = `/lists/${practiceList.id}`;
        return (
            <ListItem button key={practiceList.id} className={classes.listItem} onClick={(e) => handleClick(e, route)}>
                <ListItemText primary={practiceList.name} />
                <ListItemSecondaryAction>
                    <IconButton edge="end" aria-label="comments">
                        <PlayCircleFilledIcon />
                    </IconButton>
                </ListItemSecondaryAction>
            </ListItem>        
        );
    };   

    const practiceListComponents = practiceLists.map(practiceList => {
        return createPracticeListItem(practiceList)
    });

    return (
        <div className={classes.root}>
            <List component="nav" className={classes.list}>
                {practiceListComponents}   
            </List>
        </div>
    );
}

