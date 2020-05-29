import { useParams } from "react-router-dom";
import { makeStyles, TableContainer, Table, TableBody, TableRow, TableCell, TableHead, Paper } from "@material-ui/core";
import { PracticeRun } from "../domain/PracticeRun";
import React, { useEffect, useState } from 'react';
import backendClient from '../clients/BackendHttpClient';
import { TranslationAttempt } from "../domain/TranslationAttempt";

export default function RunPage() {

    let { runId } = useParams();
    const [run, setRun] = useState<PracticeRun>();

    useEffect(() => {
        if (runId) {
            backendClient.fetchPracticeRun(runId)
                .then(run => setRun(run));
        }
    }, []);

    const useStyles = makeStyles({
        table: {
          minWidth: 650,
        },
    });
    const classes = useStyles();

    let translationAttempts: TranslationAttempt[] = run ? run.translationAttempts : [];

    return (
        <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell align="right">Input</TableCell>
              <TableCell align="right">Correct answer</TableCell>
              <TableCell align="right">Given answer</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {translationAttempts.map((translationAttempt, index) => {
                
                let givenAnswer: string;
                if (translationAttempt.answerWasGiven) {
                    givenAnswer = translationAttempt.givenAnswer;
                } else if (translationAttempt.timedOut) {
                    givenAnswer = "<Timed out>";
                } else {
                    givenAnswer = "<No answer yet>";
                }

                return (<TableRow key={index}>
                    <TableCell component="th" scope="row">
                    {index}
                    </TableCell>
                    <TableCell align="right">{translationAttempt.input}</TableCell>
                    <TableCell align="right">{translationAttempt.correctAnswer}</TableCell>
                    <TableCell align="right">{givenAnswer}</TableCell>
                </TableRow>);
                
                }
            )}
          </TableBody>
        </Table>
      </TableContainer>
    );
}