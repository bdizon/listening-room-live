import React, {Component} from 'react';
import { Button, Grid, Typography }  from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import { Link } from "react-router-dom"


export default class RoomJoinPage extends Component {
    constructor(props) {
        super(props); 
        this.state = {  // store current roomCode and error code
            roomCode: "", // tentative room code entered in textfield
            error: ""
        };
        this.handleTextFieldChange = this.handleTextFieldChange.bind(this);
        this.roomButtonPressed = this.roomButtonPressed.bind(this);
    }

    
    // private method to handle input text
    handleTextFieldChange(e) {
        this.setState({
            roomCode: e.target.value
        });
    }

    // private method to send post request to backend
    roomButtonPressed() {
        const requestOptions = {
            method: "POST",
            headers: {'Content-Type': 'application/json'}, // kind of content
            body: JSON.stringify({  //put js object converted into json string to send
                code: this.state.roomCode
            }),
        };

        fetch('/api/join-room', requestOptions)
        .then((response) => {
            if (response.ok) {    // if valid from frontend and not server bc we know its valid
                this.props.history.push(`/room/${this.state.roomCode}`)   // redirect to valid room page; backticks for string formatting
            } else {
                this.setState({error: "Room not found."})
            }
        }).catch((error) => {   // print if request throws an error
            console.log(error);
        });
        }

    render() { // return actual html code to display
        return (
            <Grid container spacing={1} align="center">
                <Grid item xs={12}>
                    <Typography variant="h4" component="h4">
                        Join a Room
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        error={this.state.error}
                        label="Code"
                        placeholder="Enter a Room Code"
                        value={this.state.roomCode}
                        helperText={this.state.error}
                        variant="outlined"
                        onChange={this.handleTextFieldChange}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Button variant="contained" color="primary" onClick={this.roomButtonPressed}>
                        Enter Room
                    </Button> 
                </Grid>
                <Grid item xs={12}>
                    <Button variant="contained" color="secondary" to="/" component={Link}>Back</Button> 
                </Grid>
            </Grid>

        );
        
    }

}