import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Grid, Paper, createStyles, makeStyles, Theme, CircularProgress, TextField, Button, Tooltip, LinearProgress, Typography } from "@material-ui/core";
import backendClient from "../clients/BackendHttpClient";
import { PracticeRun } from "../domain/PracticeRun";
import { PracticeList } from "../domain/PracticeList";
import LanguageAvatar from "../languages/LanguageAvatar";
import { Language } from "../domain/Language";

const LINEAR_PROGRESS_RATE: number = 100;

export default function ActiveRunPage() {

    const [practiceRun, setPracticeRun] = useState<PracticeRun>();
    const [practiceList, setPracticeList] = useState<PracticeList>();
    const [sourceLanguage, setSourceLanguage] = useState<Language>();
    const [targetLanguage, setTargetLanguage] = useState<Language>();

    const [progress, setProgress] = useState<number>(0.0);
    const [answer, setAnswer] = useState<string>("");

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

        startProgressTimer(run.timePerWord * 1000.0);
    };

    const resetState = () => {
        setProgress(0.0);
        setAnswer("");
    };

    const startProgressTimer = (timePerWordMillis: number) => {
        const timer = setInterval(() => {
            setProgress((oldProgress: number) => {
                const newProgress: number = oldProgress + (LINEAR_PROGRESS_RATE / timePerWordMillis) * 100.0;
                return Math.min(100, newProgress);
            });
        }, LINEAR_PROGRESS_RATE); 

        resetState();
    }

    // Similar to componentDidMount and componentDidUpdate:
    useEffect(() => {
        if (runId) {
            fetchAllRequiredData(runId);
        }
    }, []); 

    const generateLinearProgressBar = () => {
        return (
            <div className={classes.linearProgress}>
                <Tooltip title={"a"}>
                    <LinearProgress variant="determinate" value={progress} color="secondary"/>
                </Tooltip>
            </div>
        );
    };

    const sendAnswer = () => {
        if (answer && runId) {
            backendClient.giveAnswer(answer, runId)
                .then(translationAttempt => {
                    if (translationAttempt) {

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
                            <TextField className={classes.textField} id="filled-basic" label="Submit answer..." variant="outlined" />
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