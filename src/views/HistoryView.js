import React from 'react';


export class HistoryView extends React.Component {
  constructor(props) {
    super(props);

    this._isMounted = false;

    this.state = {
      devComponents: []

    }
  }

  componentDidMount() {

    this._isMounted = true;
  }
  
  componentWillUnmount() {

  }

  // What the actual component renders
  render() {

    return (

      <div>
          jl
      </div>


    );


  }

}

