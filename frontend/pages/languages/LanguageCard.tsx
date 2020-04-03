import { Button, Container } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import { MemoryRouter as Router } from 'react-router';

type Props = {
    language: string;
};

type State = {
};

export class LanguageCard extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
    }

    render() {
        let longLanguageName: string = this.mapToLongName(this.props.language);
        let imageUrl: string = `/images/languages/${this.props.language}.png`;
        let description: string = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore " +
         "magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure " +
         "dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, " + 
         "unt in culpa qui officia deserunt mollit anim id est laborum.";
        let wikipediaLink: string = `https://en.wikipedia.org/wiki/${longLanguageName}_language`;

        return (
            <Container maxWidth="xs">
                <Card>
                    <CardMedia
                        component="img" 
                        title={longLanguageName}
                        image={imageUrl}
                        style={{
                            height: '100%',
                            width: '100%'
                        }}
                    />
                    <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">
                        {longLanguageName}
                    </Typography>
                    <Typography gutterBottom variant="body2" component="p" color="textSecondary">
                        {description}
                    </Typography>    
                    </CardContent>
                    <CardActions>
                        <Router>
                            <div>
                                <Button color="primary" onClick={e => this.redirectToUrl(e, wikipediaLink)}>
                                    Learn More
                                </Button>
                            </div>
                        </Router>
                    </CardActions>
                </Card>   
            </Container>                                 
        );
    }

    private mapToLongName(language: any): string {
        if (language == "en") {
            return "English";
        } else if (language == "zh") {
            return "Chinese";
        } else if (language == "ar") {
            return "Arabic";
        } else if (language == "de") {
            return "German";
        } else if (language == "es") {
            return "Spanish";
        } else if (language == "fr") {
            return "French";
        } else if (language == "hi") {
            return "Hindi";
        } else if (language == "nl") {
            return "Dutch";                        
        } else {
            return "Unknown";
        }
    }

    private redirectToUrl(event: any, url: string) {        
        event.preventDefault();
        window.location.href = url;        
    }
}