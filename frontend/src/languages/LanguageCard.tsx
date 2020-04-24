import { Button, Container, Collapse, IconButton } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import { MemoryRouter as Router } from 'react-router';
import { Language } from '../domain/Language';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import clsx from 'clsx';
import { red } from '@material-ui/core/colors';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';


type Props = {
    language: Language;
};

type State = {
};

export default function LanguageCard(props: Props) {

    const useStyles = makeStyles((theme: Theme) =>
        createStyles({
            root: {
                maxWidth: 345,
            },
            media: {
                height: 0,
                paddingTop: '56.25%', // 16:9
            },
            expand: {
                transform: 'rotate(0deg)',
                marginLeft: 'auto',
                transition: theme.transitions.create('transform', {
                    duration: theme.transitions.duration.shortest,
                }),
            },
            expandOpen: {
                transform: 'rotate(180deg)',
            },
            avatar: {
                backgroundColor: red[500],
            },
        }),
    );

    const [expanded, setExpanded] = React.useState(false);

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    const redirectToUrl = (event: any, url: string) => {        
        event.preventDefault();
        window.location.href = url;        
    };    

    const classes = useStyles();

    let beginningOfDescription: string = "";
    let remainderOfDescription: string = "";
    if (props.language.description.length > 0) {

        if (props.language.description[0].length >= 500) {
            beginningOfDescription = props.language.description[0].substring(0, 500) + "...";
            remainderOfDescription = props.language.description[0].substring(500);
        } else {
            beginningOfDescription = props.language.description[0]; 
        }

        remainderOfDescription = props.language.description
            .filter((value, index) => index > 0)
            .reduce((a, b) => a + b, remainderOfDescription);
    } 

    return (
        <Container maxWidth="xs">
            <Card className={classes.root} variant="outlined">
                <CardContent>
                    <CardMedia
                        component="img" 
                        title={props.language.name}
                        image={props.language.imageUrl}
                        style={{
                            height: '48px',
                            width: '64px'
                        }}
                    />
                </CardContent>
                <CardContent>
                        <Typography gutterBottom variant="h5" component="h2">
                            {props.language.name}
                        </Typography>                    
                        <Typography gutterBottom variant="body2" component="p" color="textSecondary">
                            {beginningOfDescription}
                        </Typography>    
                </CardContent>    
                <Collapse in={expanded} timeout="auto" unmountOnExit>
                    <CardContent>
                        <Typography gutterBottom variant="body2" component="p" color="textSecondary">
                            {remainderOfDescription}
                        </Typography>    
                    </CardContent>
                </Collapse>
                <CardActions>
                    <Router>
                        <div>
                            <Button color="primary" onClick={e => redirectToUrl(e, props.language.learnMoreWikipediaLink)}>
                                Learn More
                            </Button>
                        </div>
                    </Router>
                    <IconButton
                            className={clsx(classes.expand, {
                                [classes.expandOpen]: expanded,
                            })}
                            onClick={handleExpandClick}
                            aria-expanded={expanded}
                            aria-label="Show more"
                        >
                        <ExpandMoreIcon />
                    </IconButton>
                </CardActions>
            </Card>   
        </Container>                                 
    );
}