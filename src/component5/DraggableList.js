// src/DraggableList.js
import React, { useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const ItemTypes = {
  NOTE: 'note',
};

const DraggableListItem = ({ id, text, index, moveItem, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  const [, drag] = useDrag({
    type: ItemTypes.NOTE,
    item: { id, index },
  });

  const [, drop] = useDrop({
    accept: ItemTypes.NOTE,
    hover: (draggedItem) => {
      if (draggedItem.index !== index) {
        moveItem(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  return (
    <div>
      <div
        onClick={toggleOpen}
        ref={(node) => drag(drop(node))}
        style={{
          cursor: 'pointer',
          padding: '8px',
          border: '1px solid #ccc',
          marginBottom: '8px',
        }}
      >
        {text}
      </div>
      {isOpen && children && (
        <div style={{ marginLeft: '20px' }}>
          {children.map((child, childIndex) => (
            <DraggableListItem
              key={child.id}
              id={child.id}
              text={child.label}
              index={childIndex}
              moveItem={(from, to) => moveItem(index, from, to)}
              children={child.children} same 
            />
          ))}
        </div>
      )}
    </div>
  );
};

const DraggableList = () => {
  const [items, setItems] = useState([
    {
      position: 1,
      label: '0-0',
      parentId: '0',
      children:[
        {
          position: 1,
          label: '0-0-0',
          parentId: 1, 
          children: [
            {
              position: 1,
              label: '0-0-0-0',
              parentId:
            },
            {
              position: 2,
              label: '0-0-0-1',
              parentId:
            },
            {
              position: 3,
              label: '0-0-0-2',
              parentId:
            }
          ]
        },
        {
          position: "1.2",
          label: '0-0-1',
          parentId:
        },
        {
          position: '1.3',
          label: '0-0-2',
          parentId:
        }
      ]
    },
    {
      position: '2',
      label: '0-1',
      parentId:
    }
    // Your items array here
  ]);

  const moveItem = (parentIndex, fromIndex, toIndex) => {
    const updatedItems = [...items];
    const parent = updatedItems[parentIndex];

    const [movedItem] = parent.children.splice(fromIndex, 1);
    parent.children.splice(toIndex, 0, movedItem);

    setItems(updatedItems);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div style={{ width: '300px', margin: 'auto' }}>
        {items.map((item, index) => (
          <DraggableListItem
            key={item.id}
            id={item.id}
            text={item.label}
            index={index}
            moveItem={(from, to) => moveItem(index, from, to)}
            children={item.children || []}
          />
        ))}
      </div>
    </DndProvider>
  );
};

export default DraggableList;
