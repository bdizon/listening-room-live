// components can render other components
// entry point is the first component
// first component is usually called App
import React, { Component } from "react";
import { render } from "react-dom";
import HomePage from "./Homepage";

export default class App extends Component {
    constructor(props) {
        super(props);
        // this.state = {      // state of webpage to re-render component

        // }
    }

    render() { // return actual html code to display
        return (
         // need to return one element 
        <div className="center">
            {/* <h1>{this.props.name}</h1> */}
            <HomePage />
        </div>) 
        // return <h1>Testing React Code</h1>;
        // return <h1>{this.props.name}</h1>; // output the name "bianca" in the html file; use squiggly brackets to embeded js i html code
    }
}

const appDiv = document.getElementById("app"); // app component name used in html id 
render(<App />, appDiv); // renders App component in the appDiv to the index.html file
// render(<App name="bianca" />, appDiv);