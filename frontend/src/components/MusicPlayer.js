import React, { Component } from "react";
import {
    Grid,
    Typography,
    Card,
    IconButton,
    LinearProgress,
  } from "@material-ui/core";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import PauseIcon from "@material-ui/icons/Pause";
import SkipNextIcon from "@material-ui/icons/SkipNext";
//needed to import them separately bc diff buttons?

export default class MusicPlayer extends Component {
    constructor(props) {
        super(props); 
    }

    // pass request to pause
    pauseSong() {
        const requestOptions = {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
        };
        fetch("/spotify/pause", requestOptions);
    }
    // pass request to play songs
    playSong() {
        const requestOptions = {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
        };
        fetch("/spotify/play", requestOptions);
    }

    // pass request skip song
    skipSong() {
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
        };
        // fetch endpoint
        fetch("/spotify/skip", requestOptions);
    }

    // render the songs and details
    render() {
        const songProgress = (this.props.time / this.props.duration) * 100
        return (
            <Card>
                <Grid container alignItems="center">
                    <Grid item align="center" xs={4}>
                        <img src={this.props.image_url} height="100%" width="100%"/>
                    </Grid>
                    <Grid item align="center" xs={8}>
                        <Typography component="h5" variant="h5">
                            {this.props.title}
                        </Typography>
                        <Typography color="textSecondary" variant="subtitle1">
                            {this.props.artist}
                        </Typography>
                        {/* div so its not under the abover grid container */}
                        <div>
                            <IconButton onClick={ () => {
                                this.props.is_playing ? this.pauseSong() : this.playSong();
                                }}>
                                {this.props.is_playing ? <PauseIcon /> : <PlayArrowIcon />}
                            </IconButton>
                            <IconButton onClick={ () => this.skipSong()}>
                                {this.props.votes} /{" "} {this.props.votes_required}
                                <SkipNextIcon />
                            </IconButton>
                        </div>
                    </Grid>
                    {/* <LinearProgress variant="determinate" value={songProgress} /> */}
                </Grid>
                <LinearProgress variant="determinate" value={songProgress} />
            </Card>
        );
    }
}