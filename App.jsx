import React from 'react';
import Dashboard from './pages/Dashboard';
import { GoalsProvider } from './context/GoalsContext';
import './App.css';

function App() {
  return (
    <div className="App">
      <GoalsProvider>
        <Dashboard />
      </GoalsProvider>
    </div>
  );
}

export default App;


