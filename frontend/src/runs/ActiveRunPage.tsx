import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Grid, Paper, createStyles, makeStyles, Theme, CircularProgress, TextField, Button, Tooltip, LinearProgress, Typography } from "@material-ui/core";
import backendClient from "../clients/BackendHttpClient";
import { PracticeRun } from "../domain/PracticeRun";
import { PracticeList } from "../domain/PracticeList";
import LanguageAvatar from "../languages/LanguageAvatar";
import { Language } from "../domain/Language";
import websocketClient from '../clients/BackendWebSocketClient';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import StopIcon from '@material-ui/icons/Stop';
import PauseIcon from '@material-ui/icons/Pause';
import { IconButton } from '@material-ui/core';

const LINEAR_PROGRESS_RATE: number = 100;

export default function ActiveRunPage() {

    const [practiceRun, setPracticeRun] = useState<PracticeRun>();
    const [practiceList, setPracticeList] = useState<PracticeList>();
    const [sourceLanguage, setSourceLanguage] = useState<Language>();
    const [targetLanguage, setTargetLanguage] = useState<Language>();

    const [progress, setProgress] = useState<number>(0.0);
    const [answer, setAnswer] = useState<string>("");
    const [answerIsGivenOrTimeout, setAnswerIsGivenOrTimeout] = useState<boolean>(false);
    const [correctAnswerIsgiven, setCorrectAnswerIsGiven] = useState<boolean>(false);

    let { runId } = useParams();

    const useStyles = makeStyles((theme: Theme) => 
        createStyles({
            root: {
                '& > *': {
                    margin: theme.spacing(1),
                },
                               
                flexGrow: 1
            },
            paper: {
                padding: theme.spacing(2),
                textAlign: 'center',
                color: theme.palette.text.secondary,
            },
            formControl: {
                margin: theme.spacing(1),
                minWidth: 180,
            },
            selectEmpty: {
                marginTop: theme.spacing(2),
            },
            textField: {
                marginLeft: theme.spacing(1),
                marginRight: theme.spacing(1),
                width: '90ch'                
            },
            textFieldSuccess: {
                borderColor: 'green',
                borderWidth: 2,
                marginLeft: theme.spacing(1),
                marginRight: theme.spacing(1),
                width: '90ch'                
            },
            textFieldError: {
                borderColor: 'red',
                borderWidth: 2,
                marginLeft: theme.spacing(1),
                marginRight: theme.spacing(1),
                width: '90ch'
            },
            button: {
                width: '11ch',
                height: '7ch'
            },
            linearProgress: {
                width: '90ch'
            }            
        })
    );
    const classes = useStyles();

    const fetchAllRequiredData = async (runId: string) => {
        const run: PracticeRun = await backendClient.fetchPracticeRun(runId);
        const list: PracticeList = await backendClient.fetchPracticeList(run.listId);

        const sourceLanguage: Language = await backendClient.fetchLanguageByIso2Code(list.source);
        const targetLanguage: Language = await backendClient.fetchLanguageByIso2Code(list.target);

        setPracticeRun(run);
        setPracticeList(list);

        if (run.sourceToTarget) {
            setSourceLanguage(sourceLanguage);
            setTargetLanguage(targetLanguage);
        } else {
            setSourceLanguage(targetLanguage);
            setTargetLanguage(sourceLanguage);
        }
    };

    // Similar to componentDidMount, componentDidUpdate and componentDidUpdate.
    useEffect(() => {
        if (runId) {
            fetchAllRequiredData(runId);
        }
    }, []); 

    useEffect(() => {        
        websocketClient.subscribeToEvents("ActiveRunPage", handleEvent);
        websocketClient.subscribeToNotifications("ActiveRunPage", handleNotification);
    }, [practiceRun])

    const handleEvent = (event: any) => {
        console.log(`Handling event ${JSON.stringify(event)}.`)
        if (runId === event.runId && practiceRun && practiceRun.currentTranslation) {
            const name: string = event.name;
            if (name === "PracticeRunAnswerCreatedEvent") {
                resetState(practiceRun.id);
            } else if (name === "PracticeRunAnswerTimedOutEvent") {
                console.log("Current answer has timed out.");
                setAnswerIsGivenOrTimeout(true);
                setCorrectAnswerIsGiven(false);
            } else if (name === "PracticeRunAnswerGivenEvent") {
                console.log("Answer was given.");
                setAnswerIsGivenOrTimeout(true);
                setCorrectAnswerIsGiven(answer === practiceRun.currentTranslation.correctAnswer);
            } else if (name === "PracticeRunPausedEvent" || name === "PracticeRunStoppedEvent" || name === "PracticeRunRestartedEvent") {
                resetState(practiceRun.id);
            }
        }
    };

    const resetState = (runId: string) => {
        console.log("Setting up for the next answer.");

        setProgress(0.0);
        setAnswer("");

        // TODO: could be done more efficiently than reloading entire practice run.
        backendClient.fetchPracticeRun(runId).then(run => setPracticeRun(run));
    };

    const handleNotification = (notification: any) => {
        if (runId === notification.runId && practiceRun) {
            const timeSpentOnCurrentWord: number = notification.timeSpentOnCurrentWord;
            const newProgress: number = Math.min(100.0, (timeSpentOnCurrentWord / (practiceRun.timePerWord * 1000)) * 100.0);
            setProgress(newProgress);
        }
    }

    const generateLinearProgressBar = () => {
        return (
            <div className={classes.linearProgress}>
                <Tooltip title={"Time till timeout."}>
                    <LinearProgress variant="determinate" value={progress} color="secondary"/>
                </Tooltip>
            </div>
        );
    };

    const generateTextField = (practiceRun: PracticeRun) => {

        let selectedClassName: any;
        if (answerIsGivenOrTimeout) {
            if (correctAnswerIsgiven) {
                selectedClassName = classes.textFieldSuccess;
            } else {
                selectedClassName = classes.textFieldError;
            }
        } else {
            selectedClassName = classes.textField;
        }

        const handleTextFieldChange = (event: any) => {
            setAnswer(event.target.value);
        };

        return (
            <TextField error={correctAnswerIsgiven} className={answerIsGivenOrTimeout ? classes.textFieldSuccess : classes.textFieldError} 
                id="filled-basic" label="Submit answer..." variant="outlined" value={answer} onChange={handleTextFieldChange} 
                disabled={!practiceRun.isActive()}
            />        
            
        );
    }

    const sendAnswer = () => {
        console.log(`Submitting ${answer}.`);
        if (answer && runId) {
            backendClient.giveAnswer(answer, runId)
                .then(translationAttempt => {
                    if (translationAttempt) {
                        // Got 200 OK. So wait for event from backend to proceed.
                    }
                })
                .catch(error => {

                });
        }
    };

    const generateActivityChangeButtons = (practiceRun: PracticeRun) => {
        let buttons: any = [];

        let pauseButton: any = 
            <IconButton edge="end" aria-label="Pause">
                <Tooltip title="Pause" onClick={(e) => backendClient.pauseRun(practiceRun.id)}>
                    <PauseIcon />
                </Tooltip>
            </IconButton>  
        ;

        let stopButton: any = 
            <IconButton edge="end" aria-label="Stop">
                <Tooltip title="Stop" onClick={(e) => backendClient.abortRun(practiceRun.id)}>
                    <StopIcon/>
                </Tooltip>
            </IconButton>
        ;

        let playButton: any = 
            <IconButton edge="end" aria-label="Play">
                <Tooltip title="Play" onClick={(e) => backendClient.restart(practiceRun.id)}>
                    <PlayArrowIcon />
                </Tooltip>
            </IconButton>          
        ;   

        if (practiceRun.isActive()) {
            buttons = [ pauseButton, stopButton ];
        } else if (practiceRun.isPaused()) {
            buttons = [ playButton, stopButton ];
        } else {
            // Aborted or finished.
        }

        return buttons;
    };

    if (practiceRun && practiceList && sourceLanguage && targetLanguage) {
        const runTitle: string = `Run #${practiceList.runsCount} of ${practiceList.name}`;

        let inputWordDescription: string;
        if (practiceRun.currentTranslation) {
            if (practiceRun.isActive() || practiceRun.isPaused()) {
                const currentTranslation: string = practiceRun.currentTranslation.input;
                inputWordDescription = `Translate "${currentTranslation}" from ${sourceLanguage.name} to ${targetLanguage.name}`;
            } else {
                inputWordDescription = "Current practice run has been stopped.";    
            }
        } else {
            inputWordDescription = "All words have been translated.";
        }
    
        return (
            <div className={classes.root}>
                <Grid container spacing={3} direction='column' justify='space-evenly' alignItems='center'>       
                    <Grid item sm={12}>
                        <Typography variant="h3" gutterBottom>
                            {runTitle}
                        </Typography>
                    </Grid>         
                    <Grid container item sm={6} spacing={0} justify='space-evenly' alignItems='center'>
                        <Grid item>
                            <LanguageAvatar language={sourceLanguage}/> 
                        </Grid>                        
                        <Grid item>
                            <Paper className={classes.paper}>{inputWordDescription}</Paper>
                        </Grid>
                        <Grid item>
                            <LanguageAvatar language={targetLanguage}/>
                        </Grid>
                    </Grid>
                    <Grid item sm={12}>
                        <form className={classes.root} noValidate autoComplete="off">
                            {generateTextField(practiceRun)}
                            <Button className={classes.button} variant="outlined" color="inherit" onClick={(e) => sendAnswer()} disabled={!practiceRun.isActive()}>
                                Send
                            </Button>
                        </form>
                    </Grid>
                    <Grid item sm={9}>
                        {generateLinearProgressBar()}
                    </Grid>
                    <Grid item sm={9}>
                        {generateActivityChangeButtons(practiceRun)}
                    </Grid>
                </Grid>
            </div>
        );
        
    } else {
        return (
            <div className={classes.root}>
                <Grid container spacing={3} direction='column' justify='space-evenly' alignItems='center'>       
                    <Grid item sm={6}>
                        <CircularProgress color="secondary" />
                    </Grid>      
                </Grid>
            </div>
        );
    }
}