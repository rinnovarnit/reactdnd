// src/App.js
import React from 'react';
import DraggableList from './component5/DraggableList';

const App = () => {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>Drag and Drop List</h2>
      <DraggableList />
    </div>
  );
};

export default App;
