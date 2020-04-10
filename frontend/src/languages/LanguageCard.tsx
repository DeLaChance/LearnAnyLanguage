import { Button, Container } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import { MemoryRouter as Router } from 'react-router';
import { Language } from '../domain/Language';

type Props = {
    language: Language;
};

type State = {
};

export default class LanguageCard extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
    }

    render() {
        return (
            <Container maxWidth="xs">
                <Card>
                    <CardMedia
                        component="img" 
                        title={this.props.language.name}
                        image={this.props.language.imageUrl}
                        style={{
                            height: '30px',
                            width: '30px'
                        }}
                    />
                    <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">
                        {this.props.language.name}
                    </Typography>
                    <Typography gutterBottom variant="body2" component="p" color="textSecondary">
                        {this.props.language.description}
                    </Typography>    
                    </CardContent>
                    <CardActions>
                        <Router>
                            <div>
                                <Button color="primary" onClick={e => this.redirectToUrl(e, this.props.language.wikipediaLink)}>
                                    Learn More
                                </Button>
                            </div>
                        </Router>
                    </CardActions>
                </Card>   
            </Container>                                 
        );
    }

    private redirectToUrl(event: any, url: string) {        
        event.preventDefault();
        window.location.href = url;        
    }
}