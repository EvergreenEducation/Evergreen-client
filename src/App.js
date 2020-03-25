import React from 'react';
import { hot } from 'react-hot-loader/root';
import logo from './logo.svg';
import './App.css';
import { Button } from 'antd';
const dayjs = require('dayjs');

function App() {
  const date = dayjs().format('MMMM DD, YYYY');
  return (
    <div className="App">
      <header className="App-header">
        <p>
          Today is {date}
        </p>
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <Button type="link">
          <a
            className="App-link text-3xl"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </Button>
      </header>
    </div>
  );
}

export default hot(App);
