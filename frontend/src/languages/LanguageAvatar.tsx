import React from "react";
import { Avatar, Tooltip } from "@material-ui/core";
import { Language } from "../domain/Language";

export type Props = {
    language: Language;
}

export default function LanguageAvatar(props: Props) {
    return (
        <Tooltip title={props.language.name}>
            <Avatar alt={props.language.name} src={props.language.imageUrl} />                                
        </Tooltip>
    );
}