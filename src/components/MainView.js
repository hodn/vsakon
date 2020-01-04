import React from 'react';
import { BasicDeviceComponent } from './BasicDeviceComponent.js';
const { ipcRenderer } = window.require('electron');


export class MainView extends React.Component {
  constructor(props) {
    super(props);

    this._isMounted = false;

    this.state = {
      devComponents: []

    }

    this.cts = this.cts.bind(this);
  }

  componentDidMount() {

    this._isMounted = true;
      ipcRenderer.send("clear-to-send");
    

    for (let i = 0; i < 30; i++) {

      this._isMounted && this.setState((state, props) => ({
        devComponents: [...state.devComponents, <BasicDeviceComponent devId={i} key={i}/>]
      }))
    }
  }

  componentWillUnmount() {

  }

  cts(){
    ipcRenderer.send("list-ports");
  }

  // What the actual component renders
  render() {

    return (

      <div>
        
        <button onClick={this.cts}>CTS</button>

        {this.state.devComponents.map((component) => {
          return component;
        })}

        
      </div>


    );


  }

}

