import { createStyles, FormControl, Grid, IconButton, InputLabel, makeStyles, MenuItem, Paper, Select, Theme, Tooltip, Typography } from "@material-ui/core";
import ArrowLeftIcon from '@material-ui/icons/ArrowLeft';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled';
import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router";
import backendClient from "../clients/BackendHttpClient";
import { Language } from "../domain/Language";
import { PracticeList } from "../domain/PracticeList";
import LanguageAvatar from "../languages/LanguageAvatar";
import { PracticeRunConfiguration } from "../domain/PracticeRunConfiguration";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
    card: {

    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 180,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    }
  }),
);

enum TestDirection {

    SOURCE_TO_TARGET,
    TARGET_TO_SOURCE
}

export default function StartPracticeRunPage() {

    let { _practiceListId } = useParams();
    if (_practiceListId === undefined) {
        throw new Error("Practice list id is null.");
    }

    let practiceListId: string = _practiceListId;

    // Hooks. Need to be put on top.
    const [sourceLanguage, setSourceLanguage] = useState<Language>();
    const [targetLanguage, setTargetLanguage] = useState<Language>();
    const [practiceList, setPracticeList] = useState<PracticeList>();
    const [testDirection, setTestDirection] = useState<TestDirection>(TestDirection.SOURCE_TO_TARGET);
    const [timePerWord, setTimePerWord] = useState<number>(10);
    
    const classes = useStyles();
    
    let history = useHistory();
    const redirect = (route: string) => {
        history.push(route);        
    }

    // Similar to componentDidMount and componentDidUpdate:
    useEffect(() => {
        backendClient.fetchPracticeList(practiceListId)
            .then(practiceList => {
                setPracticeList(practiceList);

                backendClient.fetchLanguageByIso2Code(practiceList.source)
                    .then(sourceLanguage => setSourceLanguage(sourceLanguage));
                backendClient.fetchLanguageByIso2Code(practiceList.target)
                    .then(targetLanguage => setTargetLanguage(targetLanguage));            
            });
        
    }, [practiceListId]); 

    if (practiceList === undefined || sourceLanguage === undefined || targetLanguage === undefined) {
        return (
            <></>
        );
    } else {
        const toggleTestDirection = () => {
            if (testDirection === TestDirection.SOURCE_TO_TARGET) {
                setTestDirection(TestDirection.TARGET_TO_SOURCE);
            } else {
                setTestDirection(TestDirection.SOURCE_TO_TARGET);
            }
        };
    
        const generateTooltipTitle = () => {
            let tooltipTitle: string;
            if (testDirection === TestDirection.SOURCE_TO_TARGET) {
                tooltipTitle = `Run test translating from ${sourceLanguage.name} to ${targetLanguage.name} `;
            } else {
                tooltipTitle = `Run test translating from ${targetLanguage.name} to ${sourceLanguage.name} `;
            }

            tooltipTitle += `with ${timePerWord} seconds per word.`;
    
            return tooltipTitle;
        };
        const tooltipTitle = generateTooltipTitle();

        const timePerWordSelect = (
            <FormControl variant="filled" className={classes.formControl}>
                <InputLabel id="select-time-per-word">Time per word (s)</InputLabel>
                <Select
                    labelId="select-time-per-word" 
                    id="select-time-per-word"
                    value={timePerWord}
                    onChange={(e: any) => setTimePerWord(e.target.value)}
                >
                    <MenuItem key={5} value={5}>5</MenuItem>
                    <MenuItem key={10} value={10}>10</MenuItem>
                    <MenuItem key={15} value={15}>15</MenuItem>
                    <MenuItem key={20} value={20}>20</MenuItem>
                    <MenuItem key={30} value={30}>30</MenuItem>
                </Select>
            </FormControl>
        );

        const startRun = () => {
            let configuration: PracticeRunConfiguration = new PracticeRunConfiguration(practiceList.id, timePerWord, 
                testDirection === TestDirection.SOURCE_TO_TARGET);
            backendClient.startPracticeRun(practiceList.id, configuration)
                .then(practiceRun => redirect(`/runs/active/${practiceRun.id}`));
            // TODO: display an error here in a pop-up message
        };

        return (
            <div className={classes.root}>
                <Grid container spacing={3} direction='column' justify='space-evenly' alignItems='center'>       
                    <Grid item sm={6}>
                        <Paper className={classes.paper}>{practiceList.name}</Paper>
                    </Grid>         
                    <Grid container item sm={3} spacing={0} justify='space-evenly' alignItems='center'>
                        <Grid item>
                            <LanguageAvatar language={sourceLanguage}/>                                
                        </Grid>
                        <Grid item>
                            <IconButton edge="end" aria-label="Change direction" onClick={toggleTestDirection}>
                                <Tooltip title={tooltipTitle}>
                                {   testDirection === TestDirection.SOURCE_TO_TARGET ?
                                        <ArrowRightIcon fontSize='large'></ArrowRightIcon>
                                    :
                                        <ArrowLeftIcon fontSize='large'></ArrowLeftIcon>
                                }                            
                                </Tooltip>
                            </IconButton>
                        </Grid>
                        <Grid item>                        
                            <LanguageAvatar language={targetLanguage}/>                                
                        </Grid>
                    </Grid>
                    <Grid item sm={6}>
                        
                    </Grid>
                    <Grid item sm={6}>
                        {timePerWordSelect}                         
                    </Grid>
                    <Grid item sm={6}>
                        <Typography component="p">
                            {tooltipTitle}
                        </Typography>                            
                    </Grid>
                    <Grid item sm={6}>
                        <IconButton edge="end" aria-label="Start Test" onClick={startRun}>
                            <Tooltip title="Start Test">
                                <PlayCircleFilledIcon />
                            </Tooltip>
                        </IconButton>
                    </Grid>
                </Grid>
        </div>
        );    
    }

}