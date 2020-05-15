import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Grid, Paper, createStyles, makeStyles, Theme, Card, CardContent, Avatar, Typography } from "@material-ui/core";
import BackendHttpClient from "../clients/BackendHttpClient";
import { PracticeList } from "../domain/PracticeList";
import { Language } from "../domain/Language";
import LanguageAvatar from "../languages/LanguageAvatar";
import ArrowRightAltIcon from '@material-ui/icons/ArrowRightAlt';

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

    }
  }),
);

export default function StartPracticeRunPage() {

    let { _practiceListId } = useParams();
    if (_practiceListId === undefined) {
        throw new Error("Practice list id is null.");
    }

    let practiceListId: string = _practiceListId;

    // Hooks
    const [sourceLanguage, setSourceLanguage] = useState<Language>();
    const [targetLanguage, setTargetLanguage] = useState<Language>();
    const [practiceList, setPracticeList] = useState<PracticeList>();

    // Similar to componentDidMount and componentDidUpdate:
    useEffect(() => {
        client.fetchPracticeList(practiceListId)
            .then(practiceList => {
                setPracticeList(practiceList);

                client.fetchLanguageByIso2Code(practiceList.source)
                    .then(sourceLanguage => setSourceLanguage(sourceLanguage));
                client.fetchLanguageByIso2Code(practiceList.target)
                    .then(targetLanguage => setTargetLanguage(targetLanguage));            
            });
        
    }, []); 

    let client: BackendHttpClient = new BackendHttpClient();
    
    const classes = useStyles();

    if (practiceList === undefined || sourceLanguage === undefined || targetLanguage === undefined) {
        return (
            <></>
        );
    } else {
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
                            <ArrowRightAltIcon fontSize='large'></ArrowRightAltIcon>
                        </Grid>
                        <Grid item>                        
                            <LanguageAvatar language={targetLanguage}/>                                
                        </Grid>
                    </Grid>

                </Grid>
        </div>
        );    
    }

}