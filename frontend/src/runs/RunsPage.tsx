import { createStyles, Divider, LinearProgress, ListItemSecondaryAction, ListItemText, makeStyles, Theme, Tooltip, Typography } from '@material-ui/core';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import backendClient from '../clients/BackendHttpClient';
import websocketClient from '../clients/BackendWebSocketClient';
import { PracticeList } from '../domain/PracticeList';
import { PracticeRun } from '../domain/PracticeRun';


export default function RunsPage() {

    // Hooks
    const [runs, setRuns] = useState<PracticeRun[]>([]);
    const [listsMap, setListsMap] = useState<Map<string, PracticeList>>(new Map<string, PracticeList>());

    // Similar to componentDidMount and componentDidUpdate:
    useEffect(() => {
        backendClient.fetchPracticeRuns()
            .then(async runs => {
                let uniqueListIds: string[] = Array.from(new Set(runs.map(run => run.listId)));

                let lists: PracticeList[] = await Promise.all(uniqueListIds.map(listId => 
                    backendClient.fetchPracticeList(listId)
                ));

                let listsMap: Map<string, PracticeList> = new Map<string, PracticeList>();
                lists.forEach(list => listsMap.set(list.id, list));
                setListsMap(listsMap);

                setRuns(runs);
            });

        const handleWebsocketData = (event: any) => {
            if (event.runId && event.name) {
                console.log(`RunsPage - handling run ${event.runId} and event name ${event.name}`)
                updatePracticeRun(event.runId);
            }
        };

        const updatePracticeRun = (runId: string) => {

            backendClient.fetchPracticeRun(runId)
                .then((newRun: PracticeRun) => {
                    setRuns((prevRuns: PracticeRun[]) => [
                        ...updateRuns(prevRuns, newRun)
                    ]);
                });
        };

        websocketClient.subscribeToEvents("RunsPage", handleWebsocketData);
    }, []); 

    const updateRuns = (prevRuns: PracticeRun[], newRun: PracticeRun): PracticeRun[] => {
        let index: number = prevRuns.findIndex(run => run.id === newRun.id);
        console.log(`Run ${newRun} and index ${index}`);


        if (index >= 0 && index < prevRuns.length) {
            prevRuns[index] = newRun;
        } else {
            prevRuns.push(newRun);
        }

        return prevRuns;
    }

    const useStyles = makeStyles((theme: Theme) =>
        createStyles({
            root: {                
                backgroundColor: theme.palette.background.paper              
            },
            list: {
                margin: 'auto'
            },
            listItem: {
            },
            listItemActionBlock: {
                width: '30%',
                '& > * + *': {
                  marginTop: theme.spacing(2),
                }  
            }
        }),
    );
    const classes = useStyles();

    let history = useHistory();
    const redirect = (route: string) => {
        history.push(route);        
    }

    const groupRunsByListId = (runs: PracticeRun[]): Map<string, PracticeRun[]> => {
        let sortedRuns: PracticeRun[] = runs.sort((a,b) => a.lastActionDate.getTime() - b.lastActionDate.getTime())

        let listIdToRunsMap: Map<string, PracticeRun[]> = new Map<string, PracticeRun[]>();
        sortedRuns.forEach(run => {
            let runsForListId: PracticeRun[] = (listIdToRunsMap.get(run.listId) || []);
            runsForListId.push(run);
            listIdToRunsMap.set(run.listId, runsForListId);
        });

        return listIdToRunsMap;
    }

    const generateListItems = (listId: string, runs: PracticeRun[]): React.ReactElement[] => {
        let list: PracticeList | undefined = listsMap.get(listId);
        let runListItems: React.ReactElement[];
        if (list) {
            let aDefinedList: PracticeList = list;
            runListItems = runs.map((run, runAttemptCount) => generateListItem(aDefinedList, run, runAttemptCount + 1));        
        } else {
            runListItems = [];    
        }

        let dividerElement = <Divider key={`${listId}-divider`}></Divider>;
        runListItems.push(dividerElement);
        
        return runListItems;
    }

    const generateListItem = (list: PracticeList, run: PracticeRun, runAttemptCount: number): React.ReactElement => {



        let runDescription: string = `Run attempt ${runAttemptCount}: started at ${run.startDate.toLocaleString()}`;
        if (run.isActive()) {
            runDescription += ` and current state is ${run.status}.`;
        } else {
            runDescription += ` and finished at ${run.lastActionDate.toLocaleString()}.`;
        }

        let secondaryActionBlock: React.ReactElement = generateProgressBar(run);

        return (
            <ListItem key={run.id} className={classes.listItem} button onClick={(e) => redirect(`/runs/${run.id}`)}>
                <ListItemText primary={list.name} secondary={runDescription} />

                <ListItemSecondaryAction className={classes.listItemActionBlock}>
                    {secondaryActionBlock}
                </ListItemSecondaryAction>

            </ListItem>
        )
    }

    const generateProgressBar = (run: PracticeRun) => {

        let answeredCount: number = run.determineAnsweredCount();
        let timedOutCount: number = run.determineTimedOutCount();
        let progressCount = answeredCount + timedOutCount;

        let totalCount: number = run.determineTotalCount();
        let progressCountPercentage: number = (progressCount*100 / totalCount);
        let progressText: string = `Finished ${progressCount} words out of ${totalCount}.`;
        
        return (
            <>
            <Tooltip title={progressText}>
                <LinearProgress variant="determinate" value={progressCountPercentage} color="secondary" />                    
            </Tooltip>
            <Typography variant="subtitle2">{`Gave ${progressCount} answers out of in total ${totalCount} words`}</Typography>
            </>
        );
    };

    const runListItems: React.ReactElement[] = [];
    groupRunsByListId(runs).forEach((runs, listId) => runListItems.push(...generateListItems(listId, runs)));

    return (
        <div className={classes.root}>
            <List component="nav" className={classes.list}>
                {runListItems}   
            </List>
        </div>
    );
}