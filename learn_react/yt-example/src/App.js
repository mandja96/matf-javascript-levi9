import React, { Component } from 'react';
import './App.css';
import axios from "axios";
import Table from 'react-bootstrap/lib/Table'
import Image from 'react-bootstrap/lib/Image'

class App extends Component {
  state = {
    top100Days: [],
    top100AllTime: [],
    current: true
  }

  // koristimo Axios
  getFCCData(url, stateName) {
    console.log("Pre axios.");
    axios.get(url)
      .then(({ data }) => {
        this.setState({ [stateName]: data });
        console.log(this.state.top100Days);
      })
    console.log("Posle axios.");
  }

  pointChange(value){
    if(this.state.current !== value){
      this.setState({current: value});
    }
  }
  componentDidMount(){
    this.getFCCData('http://fcctop100.herokuapp.com/api/fccusers/top/recent', "top100Days");
    this.getFCCData('http://fcctop100.herokuapp.com/api/fccusers/top/alltime', "top100AllTime");
  }
  
  render() {
    const {top100Days, top100AllTime, current} = this.state;

    return (
      <div className="App container">
        <Table striped bordered condensed hover className="colorBlack">
          <thead>
            <tr>
              <th>#</th>
              <th>Camper Name</th>
              <th onClick={(event) => this.pointChange(true)}>Points in 30 Days</th>
              <th onClick={(event) =>this.pointChange(false)}>All Time Points</th>
            </tr>
          </thead>
          <body>
            {current && (top100Days.map((row, index)=>(
              <tr key={row.username}>
                <td> {index + 1}</td>
                <td><a href={'https://www.freecodecamp.org/${row.username}'}>
                <Image src={row.img} className="imgHeight" circle/> {row.username}
                </a></td>
                <td> {row.recent}</td>
                <td> {row.alltime}</td>

              </tr>
            )
            ))}

            {current === false && (top100AllTime.map((row, index)=>(
              <tr key={row.username}>
                <td> {index + 1}</td>
                <td><a href={'https://www.freecodecamp.org/${row.username}'}>
                <Image src={row.img} className="imgHeight" circle/> {row.username}
                </a></td>
                <td> {row.recent}</td>
                <td> {row.alltime}</td>

              </tr>
            )
            ))} 
          </body>
        </Table>
      </div>
    )
  }
}
export default App;
