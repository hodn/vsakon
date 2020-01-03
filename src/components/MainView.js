import React from 'react';
import { BasicDeviceComponent } from './BasicDeviceComponent';
const { ipcRenderer } = window.require('electron');


export class MainView extends React.Component {
  constructor(props) {
    super(props);

    this._isMounted = false;

    this.state = {
      devComponents: []

    }

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

  // What the actual component renders
  render() {

    return (

      <div>
        {this.state.devComponents.map((component) => {
          return component;
        })}

      </div>


    );


  }

}

