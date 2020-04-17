import { GridList, GridListTile } from '@material-ui/core';
import React from 'react';
import { Language } from '../domain/Language';
import LanguageCard from "./LanguageCard";
import jsonpath from 'jsonpath';
import config from '../config/config.json';

type Props = {
    iso2Codes: string[]
};

type State = {
    languages: Language[];
};

export default class LanguagePage extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);

        this.state = {
            languages: []
        };
    }

    render() {
        return (
            <div>
                <GridList cellHeight='auto' cols={1} spacing={10}>
                    {
                        this.state.languages.map((language) => (
                            <GridListTile key={language.iso2Code} cols={1}>
                                <LanguageCard language={language}/>
                            </GridListTile>
                        ))
                    }
                </GridList>            
            </div>
        );
    }

    async componentDidMount(): Promise<void> {
        let languages: Language[] = await Promise.all(this.props.iso2Codes.map(async iso2Code => {
            let language: Language = new Language(iso2Code, "");
            let description: string = await this.fetchDescription(language.wikipediaDescriptionLink);
            language.description = description;
            return language;
        }));

        this.setState({
            languages: languages
        });

        return Promise.resolve();
    }    

    private async fetchDescription(wikipediaDescriptionLink: string): Promise<string> {

        let encodedWikiLink: string = encodeURIComponent(wikipediaDescriptionLink);
        let url: string = `${config.proxyUrl}${encodedWikiLink}`;
        let res = await fetch(url);
        let wikipediaExtractJson = await res.json();
        let matches: any[] = jsonpath.query(wikipediaExtractJson, "$..extract");
        if (matches.length == 0) {
            return Promise.reject("No extract found");
        } else {
            let description: string = matches[0] as string;
            description = description.replace(/<\/?[^>]+(>|$)/g, "");
            return Promise.resolve(description);
        }        
    } 
}
