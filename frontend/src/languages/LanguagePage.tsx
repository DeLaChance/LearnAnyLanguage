import { GridList, GridListTile } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import jsonpath from 'jsonpath';
import React, { useEffect, useState } from 'react';
import backendClient from '../clients/BackendHttpClient';
import config from '../config/config.json';
import { Language } from '../domain/Language';
import LanguageCard from "./LanguageCard";

export default function LanguagePage() {

    const [languages, setLanguages] = useState<Language[]>([]);

    // Similar to componentDidMount and componentDidUpdate:
    useEffect(() => {
        const prepareLanguages = async function(): Promise<void> {
            let languages: Language[] = await backendClient.fetchLanguages();
    
            languages = await Promise.all(languages.map(async language => {
                let description: string[] = await fetchDescription(language);
                language.description = description;
                return Promise.resolve(language);
            }));
            
            setLanguages(languages);
            console.log(`Set languages to ${languages}`);
    
            return Promise.resolve();
        }

        prepareLanguages();
    }, []); 

    const fetchDescription = async function(language: Language): Promise<string[]> {

        let encodedWikiLink: string = encodeURIComponent(language.wikipediaDescriptionLink);
        let url: string = `${config.proxyUrl}${encodedWikiLink}`;
        let httpResponse = await fetch(url);

        if (httpResponse.status === 200) {
            let wikipediaExtractJson = await httpResponse.json();
            let jsonPatternMatches: any[] = jsonpath.query(wikipediaExtractJson, "$..extract");
            if (jsonPatternMatches.length === 0) {
                return Promise.reject(`No extract found at ${url} for language ${language.name}`);
            } else {
                let descriptionBlob: string = jsonPatternMatches[0] as string;
                let description: string[] = descriptionBlob.split(/<p>.*?<\/p>/gm)
                    .filter(value => value !== "" && value.length > 0)
                    .map(value => value.replace(/<\/?[^>]+(>|$)/g, "").replace(/[^\S ]+/g, ""))
                    .filter(value => value !== "" && value.length > 0);
                return Promise.resolve(description);
            }        
        } else {
            return Promise.reject(`Nothing found at link ${language.wikipediaDescriptionLink}`);
        }
    }

    const useStyles = makeStyles((theme: Theme) =>
        createStyles({
            root: {
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-around',
                overflow: 'hidden',
                backgroundColor: theme.palette.background.paper,
            },
            gridList: {
                // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
                transform: 'translateZ(0)',
                width: 500,
                height: '90%'
            },
            titleBar: {
                background:
                    'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, ' +
                    'rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
            }
        }),
    );

    const classes = useStyles();

    return (
        <div className={classes.root}>
            <GridList cellHeight='auto' cols={1} spacing={20} className={classes.gridList}>
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
