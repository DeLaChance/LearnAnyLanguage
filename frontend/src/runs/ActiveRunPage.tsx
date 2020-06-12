import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Grid, Paper, createStyles, makeStyles, Theme, CircularProgress, TextField, Button, Tooltip, LinearProgress, Typography } from "@material-ui/core";
import backendClient from "../clients/BackendHttpClient";
import { PracticeRun } from "../domain/PracticeRun";
import { PracticeList } from "../domain/PracticeList";
import LanguageAvatar from "../languages/LanguageAvatar";
import { Language } from "../domain/Language";
import websocketClient from '../clients/BackendWebSocketClient';

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

    const resetState = () => {
        setProgress(0.0);
        setAnswer("");
    };

    // Similar to componentDidMount, componentDidUpdate and componentDidUpdate.
    useEffect(() => {
        if (runId) {
            fetchAllRequiredData(runId);
        }
    }, []); 

    useEffect(() => {        
        websocketClient.subscribeToEvents(handleEvent);
        websocketClient.subscribeToNotifications(handleNotification);
    }, [practiceRun])

    const handleEvent = (event: any) => {

    };

    const handleNotification = (notification: any) => {
        if (runId === notification.runId && practiceRun) {
            const timeSpentOnCurrentWord: number = notification.timeSpentOnCurrentWord;
            const newProgress: number = Math.min(100.0, (timeSpentOnCurrentWord / (practiceRun.timePerWord * 1000)) * 100.0);
            console.log(`${runId}, ${notification.runId}, ${newProgress}`);
            setProgress(newProgress);
        }
    }

    const generateLinearProgressBar = () => {
        return (
            <div className={classes.linearProgress}>
                <Tooltip title={"a"}>
                    <LinearProgress variant="determinate" value={progress} color="secondary"/>
                </Tooltip>
            </div>
        );
    };

    const generateTextField = () => {

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

        return (
            <TextField error={correctAnswerIsgiven} className={answerIsGivenOrTimeout ? classes.textFieldSuccess : classes.textFieldError} id="filled-basic" label="Submit answer..." variant="outlined" />        
        );
    }

    const sendAnswer = () => {
        if (answer && runId) {
            backendClient.giveAnswer(answer, runId)
                .then(translationAttempt => {
                    if (translationAttempt) {
                        setAnswerIsGivenOrTimeout(true);
                        setCorrectAnswerIsGiven(answer === translationAttempt.correctAnswer);
                        // Got 200 OK. So wait for event from backend to proceed.
                    }
                })
                .catch(error => {

                });
        }
    };

    if (practiceRun && practiceList && sourceLanguage && targetLanguage) {
        const currentTranslation: string = practiceRun.currentTranslation ? 
            practiceRun.currentTranslation.input : "Chicken";
        const runTitle: string = `Run #${practiceList.runsCount} of ${practiceList.name}`;
        const inputWordDescription: string = `Translate "${currentTranslation}" from ${sourceLanguage.name} to ${targetLanguage.name}`;

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
                            {generateTextField()}
                            <Button className={classes.button} variant="outlined" color="inherit" onClick={(e) => sendAnswer()}>
                                Send
                            </Button>
                        </form>
                    </Grid>
                    <Grid item sm={9}>
                        {generateLinearProgressBar()}
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