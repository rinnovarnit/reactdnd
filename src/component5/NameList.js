import React, { useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const NameList = () => {
  const [names, setNames] = useState(['John', 'Sarah', 'Coco']);

  const moveName = (dragIndex, hoverIndex) => {
    const draggedName = names[dragIndex];
    const updatedNames = [...names];
    updatedNames.splice(dragIndex, 1);
    updatedNames.splice(hoverIndex, 0, draggedName);
    setNames(updatedNames);
  };

  const DraggableName = ({ name, index }) => {
    const [{ isDragging }, drag, preview] = useDrag({
      type: 'NAME',
      item: { name, index },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    });

    const [, drop] = useDrop({
      accept: 'NAME',
      hover: (item) => {
        if (item.index !== index) {
          moveName(item.index, index);
          item.index = index;
        }
      },
    });

    return (
      <div
        ref={(node) => {
          drag(drop(node));
          preview(node, { captureDraggingState: true });
        }}
        style={{
          opacity: isDragging ? 0.5 : 1,
          padding: '10px',
          border: '1px solid #000',
          marginBottom: '5px',
        }}
      >
        {name}
      </div>
    );
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div>
        {names.map((name, index) => (
          <DraggableName key={index} name={name} index={index} />
        ))}
      </div>
    </DndProvider>
  );
};

export default NameList;
