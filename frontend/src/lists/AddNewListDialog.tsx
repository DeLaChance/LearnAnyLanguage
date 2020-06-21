import { createStyles, Divider, FormControl, InputLabel, makeStyles, MenuItem, Theme } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Select from '@material-ui/core/Select/Select';
import TextField from '@material-ui/core/TextField';
import React, { useEffect, useState } from 'react';
import { Optional } from "typescript-optional";
import backendClient from '../clients/BackendHttpClient';
import { Language } from '../domain/Language';

export type Props = {
    open: boolean;
    handleClose: () => void;
};

export default function AddNewListDialog(props: Props) {

    // Hooks
    const [languages, setLanguages] = useState<Language[]>([]);

    const [name, setName] = useState<string>("");
    const [sourceLanguage, setSourceLanguage] = useState<Language>();
    const [targetLanguage, setTargetLanguage] = useState<Language>();
    const [errors, setErrors] = useState<boolean[]>([false, false, false, false]);

    // Asynchronous remote data fetching. 'useEffect' is similar to componentDidMount and componentDidUpdate.
    useEffect(() => {
        backendClient.fetchLanguages()
          .then(languages => setLanguages(languages));
    }, []); 

    const useStyles = makeStyles((theme: Theme) =>
        createStyles({
            formControl: {
                margin: theme.spacing(1),
                minWidth: 120,
            },
            selectEmpty: {
                marginTop: theme.spacing(2),
            },
        }),
    );
    const classes = useStyles();
  
    const languageOptions = languages.map(language => 
        (
            <MenuItem key={language.name} value={language.name}>{language.name}</MenuItem>
        )
    );
    
    const findLanguage = (name: string): Optional<Language> => {
        return Optional.ofNullable(languages.find(language => language.name === name));
    };

    const sourceLanguageSelect = (
          <FormControl variant="filled" className={classes.formControl}>
              <InputLabel id="demo-simple-select">Language 1</InputLabel>
              <Select error={errors[2] || errors[3]}
                  labelId="language"
                  id="sourceLanguage"
                  value={sourceLanguage}
                  onChange={(e: any) => findLanguage(e.target.value).ifPresent(language => setSourceLanguage(language))}
              >
                  {languageOptions}
              </Select>
          </FormControl>
    );

    const targetLanguageSelect = (
        <FormControl variant="filled" className={classes.formControl}>
            <InputLabel id="demo-simple-select">Language 2</InputLabel>
            <Select error={errors[1] || errors[3]}
                labelId="language"
                id="targetLanguage"
                value={targetLanguage}
                onChange={(e: any) => findLanguage(e.target.value).ifPresent(language => setTargetLanguage(language))}
            >
                {languageOptions}
            </Select>
        </FormControl>
    );

    const createList = () => {
        let errors: boolean[] = [false, false, false, false];
        let noErrors: boolean = true;

        if (name === "") {
            errors[0] = true;
            noErrors = false;
        }

        if (!targetLanguage) {
            errors[1] = true;
            noErrors = false;
        }

        if (!sourceLanguage) {
            errors[2] = true;
            noErrors = false;
        }

        if (sourceLanguage === targetLanguage) {
            errors[3] = true;
            noErrors = false;
        }

        if (noErrors && targetLanguage && sourceLanguage) {
            backendClient.createNewList(name, sourceLanguage, targetLanguage)
              .then(list => props.handleClose());
        } else {
            setErrors(errors);
        }        
    };

    return (
        <div>
          <Dialog open={props.open} onClose={props.handleClose} aria-labelledby="form-dialog-title">
              <DialogTitle id="form-dialog-title">Add new list</DialogTitle>
              <DialogContent>
                  <TextField error={errors[0]} value={name} autoFocus margin="dense" 
                      id="name" label="Name of the list" fullWidth helperText="Name cannot be empty"
                      onChange={(e: any) => setName(e.target.value)}
                  />
              </DialogContent>
              <Divider />
              {sourceLanguageSelect}
              <Divider />
              {targetLanguageSelect}
              <DialogActions>
                  <Button onClick={props.handleClose} color="default">
                      Cancel
                  </Button>
                  <Button onClick={createList} color="default">
                      Create
                  </Button>
              </DialogActions>
          </Dialog>
        </div>
    );
}
