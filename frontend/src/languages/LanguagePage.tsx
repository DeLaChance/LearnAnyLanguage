import { GridList, GridListTile } from '@material-ui/core';
import React from 'react';
import { Language } from '../domain/Language';
import LanguageCard from "./LanguageCard";

type Props = {
    iso2Codes: string[]
};

type State = {
};

export default class LanguagePage extends React.Component<Props, State> {

    render() {
        let languages: Language[] = [new Language("nl", "Nederlands")]; /*await Promise.all(this.props.iso2Codes.map(async iso2Code => {
            let description: string = await this.fetchDescription(iso2Code);
            return new Language(iso2Code, description);
        }));*/

        return (
            <div>
                <GridList cellHeight='auto' cols={1} spacing={10}>
                    {
                        languages.map((language) => (
                            <GridListTile key={language.iso2Code} cols={1}>
                                <LanguageCard language={language}/>
                            </GridListTile>
                        ))
                    }
                </GridList>            
            </div>
        );
    }

    private async fetchDescription(iso2Code: string): Promise<string> {

        let res = await fetch(`https://en.wikipedia.org/w/api.php?action=query' + 
            '&prop=extracts&format=json&exintro=&titles=${iso2Code}%20language`);
        let wikipediaExtractJson = await res.json();

        let description: string = wikipediaExtractJson["query"]["pages"]["8569916"]["extract"];
        return Promise.resolve(description);
    } 
}
