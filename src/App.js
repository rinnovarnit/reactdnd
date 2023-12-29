// src/App.js
import React from 'react';
import NameList from './component5/NameList';
import DraggableList from './component5/DraggableList';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';
import ListContainer from './component5/ListContainer';

const App = () => {
  
  return (
    <DndProvider backend={HTML5Backend}>
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <h2>Drag and Drop List</h2>
        <DraggableList/>
      </div>    
    </DndProvider>
  );
};

export default App;
