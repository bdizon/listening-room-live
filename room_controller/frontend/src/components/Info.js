import React, { useState, useEffect } from "react";
import { Grid, Button, Typography, IconButton } from "@material-ui/core";
import NavigateBeforeIcon from "@material-ui/icons/NavigateBefore";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import { Link } from "react-router-dom";

const pages = {
    JOIN: 'pages.join',
    CREATE: 'pages.create',
};

// functional component
// function instead of class
export default function Info(props) {
    // state name and state function
    // hook useState
    // set up state variable
    const[page, setPage] = useState(pages.JOIN);

    function joinInfo() {
        return(
            <Grid container spacing={1}>
                <Grid item xs={12} align="center">
                    <Typography component="h6" variant="h6">
                        Enter a Room Code and join friends for a social-distancing party.
                    </Typography>
                </Grid>
            </Grid>
        );
    };

    function createInfo() {
        return(
            <Grid container spacing={1}>
                <Grid item xs={12} align="center">
                    <Typography component="h6" variant="h6">
                        Create a room, control it's settings, control the music. Invite friends using the given Room Code.
                    </Typography>
                    <Typography component="h10" variant="h10">
                        Note: This app does not collect any data regarding your Spotify account. It simply allows you to listen to music with friends.
                    </Typography>
                </Grid>
            </Grid>
        );
    };

    // useEffect hook
    // use instead of componentdidmount and componentwillunmount
    useEffect(() => {
        console.log("ran")
        // acts like unmount, will be called after component unmounts
        return () => console.log("cleanup")
    });

    // re-render component and set page = 2
    // setPage(2);
    return(
        <Grid container spacing={1}>
            <Grid item xs={12} align="center">
                <Typography component="h4" variant="h4">
                    What is Listening Room?
                </Typography>
            </Grid>
            <Grid item xs={12} align="center">
                <Typography variant="body1">
                    {page === pages.JOIN ? joinInfo() : createInfo()}
                </Typography>
            </Grid>
            <Grid item xs={12} align="center">
                <IconButton onClick={() => {page === pages.CREATE ? setPage(pages.JOIN) : setPage(pages.CREATE);
                }}
                >
                    {page === pages.CREATE ? (<NavigateBeforeIcon />) : (<NavigateNextIcon />)
                }
                </IconButton>
            </Grid>
            <Grid item xs={12} align="center">
                <Button color="secondary" variant="contained" to="/" component={Link}>
                    Back
                </Button>
            </Grid>
        </Grid>

    );
}

<Info title="hello"></Info>