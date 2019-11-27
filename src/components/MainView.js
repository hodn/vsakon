import React from 'react';
import { TimeSeries } from 'react-smoothie';
import SmoothieComponent from 'react-smoothie';
const { ipcRenderer } = window.require('electron');

export class MainView extends React.Component{
  constructor(props){
    super(props);
    
    this._isMounted = false;
    
    this.state = {
        data: new TimeSeries(),
        elements: ["i", "i","i","i","i","i","i","i","i","i","i","i","i","i","i","i","i","i","i","i","i","i","i","i","i","i", "i","i","i","i","i","i","i","i","i","i" ]
    }

  }

  componentDidMount() {
    
    this._isMounted = true;
    
    ipcRenderer.send("clear-to-send");
    ipcRenderer.on('data', (event, arg) => {
    console.log(this.state.elements.length)         
    const time = new Date();
    const data = this.state.data;
    data.append(time, arg);

    if(this._isMounted){
      this.setState({
        data: data
      })
    }
    })

  }

  componentWillUnmount(){
    
}
  
// What the actual component renders
  render(){    

      return(
        
        <div>
          {this.state.elements.map(reptile => 
            
            
            <SmoothieComponent
            responsive
            millisPerPixel={70}
            scaleSmoothing={0.08}
            interpolation="linear"
            height={250}
            timestampFormatter={date => {
            if(date.getSeconds() % 20 === 0){
                return date.toLocaleTimeString()
            }else{
                return ""
            }
            } }
            grid={{millisPerLine:4000,verticalSections:5}}
            labels={{fontSize:14,precision:1}}
            series={[
            {
                data: this.state.data,
                strokeStyle: { g: 255 },
                fillStyle: { g: 255 },
                lineWidth: 4,
            }
            ]}
        />
            
            
            
            
            
            )}
          
        </div>

      
      );
    
    
  }
    
}

