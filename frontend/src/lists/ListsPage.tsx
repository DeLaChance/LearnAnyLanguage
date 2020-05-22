import { IconButton, ListItemSecondaryAction, Tooltip } from '@material-ui/core';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import EditIcon from '@material-ui/icons/Edit';
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled';
import SchoolIcon from '@material-ui/icons/School';
import React, { useEffect, useState } from 'react';
import { useHistory } from "react-router-dom";
import backendClient from '../clients/BackendHttpClient';
import { PracticeList } from '../domain/PracticeList';
import AddNewListDialog from './AddNewListDialog';
import UploadFileDialog from './UploadFileDialog';

export default function ListsPage() {

    // Hooks
    const [practiceLists, setPracticeLists] = useState<PracticeList[]>([]);
    const [openAddNewListDialog, setOpenAddNewListDialog] = React.useState(false);
    const [openUploadFileDialog, setOpenUploadFileDialog] = React.useState(false);    

    // Similar to componentDidMount and componentDidUpdate:
    useEffect(() => {
        preparePracticeLists();
    }, []); 

    const preparePracticeLists = async function(): Promise<void> {

        backendClient.fetchPracticeLists()
            .then(practiceLists => setPracticeLists(practiceLists));
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
    const redirect = (route: string) => {
        history.push(route);        
    }

    const createPracticeListItem = (practiceList: PracticeList): React.ReactElement => {
        let editListRoute: string = `/lists/${practiceList.id}`;
        let startRunRoute: string = `/runs/${practiceList.id}/start`;
        let viewRunsRoute: string = `/runs/${practiceList.id}`;
        return (
            <ListItem button key={practiceList.id} className={classes.listItem}>
                <ListItemText primary={practiceList.name} />
                <ListItemSecondaryAction>
                    <IconButton edge="end" aria-label="Edit list">
                        <Tooltip title="Edit" onClick={(e) => redirect(editListRoute)}>
                            <EditIcon/>
                        </Tooltip>
                    </IconButton>                    
                    <IconButton edge="end" aria-label="Start test">
                        <Tooltip title="Start test" onClick={(e) => redirect(startRunRoute)}>
                            <PlayCircleFilledIcon/>
                        </Tooltip>
                    </IconButton>
                    <IconButton edge="end" aria-label="Results">
                        <Tooltip title="Results" onClick={(e) => redirect(viewRunsRoute)}>
                            <SchoolIcon/>
                        </Tooltip>
                    </IconButton>
                </ListItemSecondaryAction>
            </ListItem>        
        );
    };   

    const practiceListComponents = practiceLists
        .sort((a,b) => a.name.localeCompare(b.name))
        .map(practiceList => {
            return createPracticeListItem(practiceList)
        });

    const refreshPage = () => {
        setOpenAddNewListDialog(false);
        setOpenUploadFileDialog(false);
        preparePracticeLists();        
    };

    const addNewListDialog = (
        <AddNewListDialog 
            open={openAddNewListDialog} 
            handleClose={refreshPage}            
        />
    );

    const uploadFileDialog = (
        <UploadFileDialog
            open={openUploadFileDialog}
            handleClose={refreshPage}
            handleSave={(file: File) => backendClient.uploadPracticeList(file).then(() => refreshPage())}
        />
    )

    return (
        <div className={classes.root}>
            <List component="nav" className={classes.list}>
                {practiceListComponents}   
            </List>

            <IconButton edge="end" aria-label="Add new list">
                <Tooltip title="Add new list" onClick={(e) => setOpenAddNewListDialog(true)}>
                    <AddCircleIcon />
                </Tooltip>
            </IconButton>

            <IconButton edge="end" aria-label="Upload a file" onClick={(e) => setOpenUploadFileDialog(true)}>
                <Tooltip title="Upload a file">
                    <CloudUploadIcon />
                </Tooltip>
            </IconButton>

            {addNewListDialog}
            {uploadFileDialog}

        </div>
    );
}

