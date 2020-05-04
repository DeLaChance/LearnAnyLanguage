import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { useHistory } from 'react-router';
import React from 'react';

export type Props = {
    goTo: string | undefined
};

export default function ArrowBackButton(props: Props) {

    let history = useHistory();
    const handleClick = () => {
        if (props.goTo) {
            history.push(props.goTo);
        } else {
            history.goBack();
        }
    }

    return (
        <ArrowBackIcon onClick={handleClick}></ArrowBackIcon>
    );
}