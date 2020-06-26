import Snackbar from '@material-ui/core/Snackbar';
import { makeStyles, Theme } from '@material-ui/core/styles';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';
import React from 'react';

export type Props = {
    errorMessage: string;
    open: boolean;
    close: (() => void);
};

export default function ErrorMessageSnackbar(props: Props) {

    function Alert(props: AlertProps) {
        return <MuiAlert elevation={6} variant="filled" {...props} />;
    }
      
    const useStyles = makeStyles((theme: Theme) => ({
        root: {
            width: '100%',
                '& > * + *': {
                    marginTop: theme.spacing(2),
            },
        },
    }));

    const classes = useStyles();

    return (
        <div className={classes.root}>
            <Snackbar open={props.open} autoHideDuration={5000} onClose={props.close}>
                <Alert severity="error">
                    {props.errorMessage}
                </Alert>
            </Snackbar>
        </div>
    );
}