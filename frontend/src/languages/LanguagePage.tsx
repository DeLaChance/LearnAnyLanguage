import { GridList, GridListTile } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import jsonpath from 'jsonpath';
import React, { useEffect, useState } from 'react';
import config from '../config/config.json';
import { Language } from '../domain/Language';
import LanguageCard from "./LanguageCard";

type Props = {
    iso2Codes: string[]
};

export default function LanguagePage(props: Props) {

    const [languages, setLanguages] = useState<Language[]>([]);

    // Similar to componentDidMount and componentDidUpdate:
    useEffect(() => {
        prepareLanguages();
    }); 

    const prepareLanguages = async function(): Promise<void> {
        let languages: Language[] = await Promise.all(props.iso2Codes.map(async iso2Code => {
            let language: Language = new Language(iso2Code, []);
            let description: string[] = await fetchDescription(language.wikipediaDescriptionLink);
            language.description = description;
            return language;
        }));
        
        setLanguages(languages);

        return Promise.resolve();
    }

    const fetchDescription = async function(wikipediaDescriptionLink: string): Promise<string[]> {

        let encodedWikiLink: string = encodeURIComponent(wikipediaDescriptionLink);
        let url: string = `${config.proxyUrl}${encodedWikiLink}`;
        let res = await fetch(url);
        let wikipediaExtractJson = await res.json();
        let jsonPatternMatches: any[] = jsonpath.query(wikipediaExtractJson, "$..extract");
        if (jsonPatternMatches.length == 0) {
            return Promise.reject("No extract found");
        } else {
            let descriptionBlob: string = jsonPatternMatches[0] as string;
            let description: string[] = descriptionBlob.split(/<p>.*?<\/p>/gm)
                .filter(value => value !== "" && value.length > 0)
                .map(value => value.replace(/<\/?[^>]+(>|$)/g, "").replace(/[^\S ]+/g, ""))
                .filter(value => value !== "" && value.length > 0);
            return Promise.resolve(description);
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
