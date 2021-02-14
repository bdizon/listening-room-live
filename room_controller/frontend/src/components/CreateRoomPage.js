import React, {Component} from 'react';
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import { Link } from "react-router-dom";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { Collapse } from "@material-ui/core";
import Alert  from "@material-ui/lab/Alert";

export default class CreateRoomPage extends Component {
    static defaultProps = {
      votesToSkip: 2,
      guestCanPause: true,
      update: false,
      roomCode: null,
      updateCallback: () => {},
    };
  
    constructor(props) {
      super(props);
        // default state, forces component to change state, send info to backend
        this.state = {
            guestCanPause: this.props.guestCanPause,
            votesToSkip: this.props.votesToSkip,
            errorMsg: "",
            successMsg: "",
        };
      
        this.handleRoomButtonPressed = this.handleRoomButtonPressed.bind(this);
        this.handleVotesChange = this.handleVotesChange.bind(this);
        this.handleGuestCanPauseChange = this.handleGuestCanPauseChange.bind(this);
        this.handleUpdateButtonPressed = this.handleUpdateButtonPressed.bind(this); // bind method to class, can have access to this keyword in method
        // this.renderUpdateButtons = this.renderUpdateButtons.bind(this); 
        // this.renderCreateButtons = this.renderCreateButtons.bind(this);
       

    }

    // updates state votes 
    handleVotesChange(e) {
        // modify state in react
        this.setState({
            votesToSkip: e.target.value, // get object that called this value and updates
        });
    }
    // updates state if users can pause/play 
    handleGuestCanPauseChange(e) {
        this.setState({
            guestCanPause: e.target.value === "true" ? true : false
        });
    }

    //
    handleRoomButtonPressed() {
        // send request to endpoint to allow to create new room
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'}, // kind of content
            body: JSON.stringify({  //put js object converted into json string to send
                votes_to_skip: this.state.votesToSkip,    // field names have to match the names in the server
                guest_can_pause: this.state.guestCanPause
            }),
        };
        // send request to localhost or wherever react is running on to api/create-room
        //once we get a response convert it to json
        // then take the data and do something with it
        fetch("/api/create-room", requestOptions)
            .then((response) => response.json())
            // .then((data) => console.log(this.props.toString()));
            .then((data) => this.props.history.push("/room/" + data.code));
    }

    // room update request to backend point
    handleUpdateButtonPressed() {
        // send request to endpoint to allow to create new room
        const requestOptions = {
            method: 'PATCH',    // UpdateRoom class in views.py takes patch request not a post
            headers: {'Content-Type': 'application/json'}, // kind of content
            body: JSON.stringify({  //put js object converted into json string to send
                votes_to_skip: this.state.votesToSkip,    // field names have to match the names in the server
                guest_can_pause: this.state.guestCanPause,
                code: this.props.roomCode,
            }),
        };
        fetch("/api/update-room", requestOptions).then((response) => {
            if (response.ok) {
                this.setState({
                    successMsg: "Room updated successfully!"
                });
            } else {
                this.setState({
                    errorMsg: "Error updating room..."
                });
            }
            this.props.updateCallback();
        });
    }

    // method for rendering create buttons
    // rendering a grid container inside a grid container wont affect how it looks
    renderCreateButtons() {
        return (
            <Grid container spacing={1}>
                <Grid item xs={12} align="center">
                    <Button color="primary" variant="contained" onClick={this.handleRoomButtonPressed}>
                        Create A Room
                    </Button>
                </Grid>
                <Grid item xs={12} align="center">
                    <Button color="secondary" variant="contained" to="/" component={Link}>
                        Back
                    </Button>
                </Grid>
            </Grid>
        );

    }

    // method for rendering update buttons
    // grid doesnt need a higher level grid container bc its just one grid item
    renderUpdateButtons() {
        return (
            <Grid item xs={12} align="center">
                <Button color="primary" variant="contained" onClick={this.handleUpdateButtonPressed}>
                    Update Room
                </Button>
            </Grid>
            
        );
    }


    render() { // return actual html code to display
        // return actual html code to display
         // aligns items horizontally or verically in a column structure (container)
         // uses css flexbox
         // spacing how much space in between boxes
         // 12 fills the entire screen
         // new grid item to store error/succcess msgs
        const title = this.props.update ? "Update Room" : "Create Room";
        return (
        <Grid container spacing={1}>
            <Grid item xs={12} align="center">      
                <Collapse in={this.state.errorMsg != "" || this.state.successMsg != ""}>
                    {this.state.successMsg != "" ? (<Alert serverity="success" onClose={() => {this.setState({ successMsg: ""});}
                    }>{this.state.successMsg}</Alert>) : (<Alert sverity="error" onClose={() => {this.setState({ errorMsg: ""});}
                }>{this.state.errorMsg}</Alert>)}
                </Collapse>
            </Grid>
            <Grid item xs={12} align="center">      
                <Typography component="h4" variant="h4">
                    {title}
                </Typography>
            </Grid>
            <Grid item xs={12} align="center">      
                <FormControl component="fieldset">
                    <FormHelperText>
                        <div align="center">
                            Guest Control of Playback State
                        </div>
                    </FormHelperText>
                    <RadioGroup row defaultValue={this.props.guestCanPause.toString()} onChange={this.handleGuestCanPauseChange}>
                        <FormControlLabel 
                            value="true" 
                            control={<Radio color="primary"/>} 
                            label="Play/Pause"
                            labelPlacement="bottom"/>
                        <FormControlLabel 
                            value="false" 
                            control={<Radio color="secondary"/>} 
                            label="No Control"
                            labelPlacement="bottom"/>
                    </RadioGroup>
                </FormControl>        
            </Grid>
            <Grid item xs={12} align="center">
                <FormControl>
                    <TextField required={true} 
                        type="number" 
                        onChange={this.handleVotesChange} 
                        defaultValue={this.state.votesToSkip.toString()} 
                        inputProps={{min: 1, style: { textAlign: "center" },}}/>
                    <FormHelperText>
                        <div align="center">
                            Votes Required to Skip Song
                        </div>
                    </FormHelperText>
                </FormControl>
            </Grid>
            {this.props.update ? this.renderUpdateButtons() : this.renderCreateButtons()} 
        </Grid> 
        );
    }
}

// import React, { Component } from "react";
// import Button from "@material-ui/core/Button";
// import Grid from "@material-ui/core/Grid";
// import Typography from "@material-ui/core/Typography";
// import TextField from "@material-ui/core/TextField";
// import FormHelperText from "@material-ui/core/FormHelperText";
// import FormControl from "@material-ui/core/FormControl";
// import { Link } from "react-router-dom";
// import Radio from "@material-ui/core/Radio";
// import RadioGroup from "@material-ui/core/RadioGroup";
// import FormControlLabel from "@material-ui/core/FormControlLabel";
// import { Collapse } from "@material-ui/core";
// import Alert from "@material-ui/lab/Alert";

// export default class CreateRoomPage extends Component {
//   static defaultProps = {
//     votesToSkip: 2,
//     guestCanPause: true,
//     update: false,
//     roomCode: null,
//     updateCallback: () => {},
//   };

//   constructor(props) {
//     super(props);
//     this.state = {
//       guestCanPause: this.props.guestCanPause,
//       votesToSkip: this.props.votesToSkip,
//       errorMsg: "",
//       successMsg: "",
//     };

//     this.handleRoomButtonPressed = this.handleRoomButtonPressed.bind(this);
//     this.handleVotesChange = this.handleVotesChange.bind(this);
//     this.handleGuestCanPauseChange = this.handleGuestCanPauseChange.bind(this);
//     this.handleUpdateButtonPressed = this.handleUpdateButtonPressed.bind(this);
//   }

//   handleVotesChange(e) {
//     this.setState({
//       votesToSkip: e.target.value,
//     });
//   }

//   handleGuestCanPauseChange(e) {
//     this.setState({
//       guestCanPause: e.target.value === "true" ? true : false,
//     });
//   }

//   handleRoomButtonPressed() {
//     const requestOptions = {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         votes_to_skip: this.state.votesToSkip,
//         guest_can_pause: this.state.guestCanPause,
//       }),
//     };
//     fetch("/api/create-room", requestOptions)
//       .then((response) => response.json())
//       .then((data) => this.props.history.push("/room/" + data.code));
//   }

//   handleUpdateButtonPressed() {
//     const requestOptions = {
//       method: "PATCH",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         votes_to_skip: this.state.votesToSkip,
//         guest_can_pause: this.state.guestCanPause,
//         code: this.props.roomCode,
//       }),
//     };
//     fetch("/api/update-room", requestOptions).then((response) => {
//       if (response.ok) {
//         this.setState({
//           successMsg: "Room updated successfully!",
//         });
//       } else {
//         this.setState({
//           errorMsg: "Error updating room...",
//         });
//       }
//       this.props.updateCallback();
//     });
//   }

//   renderCreateButtons() {
//     return (
//       <Grid container spacing={1}>
//         <Grid item xs={12} align="center">
//           <Button
//             color="primary"
//             variant="contained"
//             onClick={this.handleRoomButtonPressed}
//           >
//             Create A Room
//           </Button>
//         </Grid>
//         <Grid item xs={12} align="center">
//           <Button color="secondary" variant="contained" to="/" component={Link}>
//             Back
//           </Button>
//         </Grid>
//       </Grid>
//     );
//   }

//   renderUpdateButtons() {
//     return (
//       <Grid item xs={12} align="center">
//         <Button
//           color="primary"
//           variant="contained"
//           onClick={this.handleUpdateButtonPressed}
//         >
//           Update Room
//         </Button>
//       </Grid>
//     );
//   }

//   render() {
//     const title = this.props.update ? "Update Room" : "Create a Room";

//     return (
//       <Grid container spacing={1}>
//         <Grid item xs={12} align="center">
//           <Collapse
//             in={this.state.errorMsg != "" || this.state.successMsg != ""}
//           >
//             {this.state.successMsg != "" ? (
//               <Alert
//                 severity="success"
//                 onClose={() => {
//                   this.setState({ successMsg: "" });
//                 }}
//               >
//                 {this.state.successMsg}
//               </Alert>
//             ) : (
//               <Alert
//                 severity="error"
//                 onClose={() => {
//                   this.setState({ errorMsg: "" });
//                 }}
//               >
//                 {this.state.errorMsg}
//               </Alert>
//             )}
//           </Collapse>
//         </Grid>
//         <Grid item xs={12} align="center">
//           <Typography component="h4" variant="h4">
//             {title}
//           </Typography>
//         </Grid>
//         <Grid item xs={12} align="center">
//           <FormControl component="fieldset">
//             <FormHelperText>
//               <div align="center">Guest Control of Playback State</div>
//             </FormHelperText>
//             <RadioGroup
//               row
//               defaultValue={this.props.guestCanPause.toString()}
//               onChange={this.handleGuestCanPauseChange}
//             >
//               <FormControlLabel
//                 value="true"
//                 control={<Radio color="primary" />}
//                 label="Play/Pause"
//                 labelPlacement="bottom"
//               />
//               <FormControlLabel
//                 value="false"
//                 control={<Radio color="secondary" />}
//                 label="No Control"
//                 labelPlacement="bottom"
//               />
//             </RadioGroup>
//           </FormControl>
//         </Grid>
//         <Grid item xs={12} align="center">
//           <FormControl>
//             <TextField
//               required={true}
//               type="number"
//               onChange={this.handleVotesChange}
//               defaultValue={this.state.votesToSkip}
//               inputProps={{
//                 min: 1,
//                 style: { textAlign: "center" },
//               }}
//             />
//             <FormHelperText>
//               <div align="center">Votes Required To Skip Song</div>
//             </FormHelperText>
//           </FormControl>
//         </Grid>
//         {this.props.update
//           ? this.renderUpdateButtons()
//           : this.renderCreateButtons()}
//       </Grid>
//     );
//   }
// }