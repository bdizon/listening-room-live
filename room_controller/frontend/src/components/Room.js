import React, { Component } from "react";
import { Grid, Button, Typography } from "@material-ui/core";
import CreateRoomPage from "./CreateRoomPage";
import MusicPlayer from "./MusicPlayer";

export default class Room extends Component {
    constructor(props) {
        super(props);
        this.state = {
            votesToSkip: 2,
            guestCanPause: false,
            isHost: false,
            showSettings: false,    // use to indicate if settings option should be shown
            spotifyAuthenticated: false,
            song: {}, // store all info in song in state of component so it is updated with state
        };

        this.roomCode = this.props.match.params.roomCode; // match is the prop with info about how we go to the component from the react routers

        // use room code to request to get its data from the backend
        this.leaveButtonPressed = this.leaveButtonPressed.bind(this);
        this.updateShowSettings = this.updateShowSettings.bind(this);
        this.renderSettingsButton = this.renderSettingsButton.bind(this);
        this.renderSettings = this.renderSettings.bind(this);
        this.getRoomDetails = this.getRoomDetails.bind(this);
        this.authenticateSpotify = this.authenticateSpotify.bind(this);
        this.getCurrentSong = this.getCurrentSong.bind(this);
        this.getRoomDetails();
        // this.getCurrentSong();
    }

    // spotify did not implement web sockets so we cant expect to continuously get updates on the requested data 
    // solution is polling, but not optimal solution bc this is a lot of requests, but for this website size it should work
    // set up an interval to update
    // lifecycle method
    // component mounts on the screen, then do work
    componentDidMount() {
        this.interval = setInterval(this.getCurrentSong, 1000);   // built-in, delay is 1000 ms = 1 second
    }

    // clean up operatios, have to stop interval 
    componentWillUnmount() {
        clearInterval(this.interval);   // stop interval from running
    }


    // function to get room details
    // edit: make sure response is valid
    getRoomDetails() {
        return fetch("/api/get-room" + "?code=" + this.roomCode)
            .then((response) => {
                if (!response.ok) {
                this.props.leaveRoomCallback();
                this.props.history.push("/");
                }
                return response.json();
            })
            .then((data) => {
                this.setState({
                votesToSkip: data.votes_to_skip,
                guestCanPause: data.guest_can_pause,
                isHost: data.is_host,
                });
                if (this.state.isHost) {
                this.authenticateSpotify(); // send user url to authenticate app's access to spotify info
                }
            });
    }

    //
    authenticateSpotify() {
        fetch("/spotify/is-authenticated")
            .then((response) => response.json())
            .then((data) => {
                this.setState({ spotifyAuthenticated: data.status });
                console.log(data.status);
                if (!data.status) {
                fetch("/spotify/get-auth-url")
                    .then((response) => response.json())
                    .then((data) => {
                    window.location.replace(data.url);
                    });
                }
        });
    }

    // method to get info from response from /spotify/current-song
    getCurrentSong() {
        fetch("/spotify/current-song").then((response) => {
            if (!response.ok) {
                return {};
            } else {
                return response.json();
            }
          })
          .then((data) => {
            this.setState({ song: data });
            console.log(data);
          });
      }
    

    // leave room 
    // edit: added line 49 to set state of homepage roomCode: null
    leaveButtonPressed() {
        const requestOptions = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        };
        fetch("/api/leave-room", requestOptions).then((_response) => {
          this.props.leaveRoomCallback();
          this.props.history.push("/");
        });
    }

    // change the state of showSettings
    updateShowSettings(value) {
        this.setState({
          showSettings: value,
        });
    }

    // render what the settings are
    // add grid container because it is its own page
    // reuse the createroompage to use its formatting for the settings page
    renderSettings() {
        return (
            <Grid container spacing={1}>
                <Grid item xs={12} align="center">
                    <CreateRoomPage
                        update={true}
                        votesToSkip={this.state.votesToSkip}
                        guestCanPause={this.state.guestCanPause}
                        roomCode={this.roomCode}
                        updateCallback={this.getRoomDetails}
                    />
                </Grid>
                <Grid item xs={12} align="center">
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => this.updateShowSettings(false)}
                    >
                        Close
                    </Button>
                </Grid>
            </Grid>
        );
    }

    // method that renders the settings button
    // only want to show settings when user is host
    renderSettingsButton() {
        return(
            <Grid item xs={12} align="center">
                <Button variant="contained" color="primary" onClick={() => this.updateShowSettings(true)}>
                    Room Settings
                </Button>
            </Grid>
        );
    }

    render() {
        // render this view when updateShowsSettings is true and showSettings is true
        if (this.state.showSettings) {
            return this.renderSettings();
        }
        return (
            <Grid container spacing={1}>
                <Grid item xs={12} align="center">
                    <Typography variant="h4" component="h4">
                        Code: {this.roomCode}
                    </Typography>
                </Grid>
                {/* {this.state.song} */}
                {/* spread operator, will pass the props to the MusicPlayer */}
                <MusicPlayer {...this.state.song} />
                {this.state.isHost ? this.renderSettingsButton() : null}    
                <Grid item xs={12} align="center">
                    <Button variant="contained" color="secondary" onClick={this.leaveButtonPressed}>
                        Leave Room
                    </Button>
                </Grid>
            </Grid>
        
        );
    }

}

