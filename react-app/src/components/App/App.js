import React from 'react';
import './App.css';
import LeaderBoard from '../Leaderboard/LeaderBoard';

class App extends React.Component {
  render() {
    return (
      <div className="wrapper">
        <LeaderBoard />
      </div>
    );
  }
}

export default App;
