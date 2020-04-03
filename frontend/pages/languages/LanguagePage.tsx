import React from "react";
import { LanguageCard } from "./LanguageCard";

type Props = {
};

type State = {
};

export class LanguagePage extends React.Component<Props, State> {
    render() {
        return (
            <LanguageCard language="hi" />
        );
    }
}