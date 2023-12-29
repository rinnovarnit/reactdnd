// ListContainer.js
import React, { useState } from 'react';
import { DndProvider, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import ListItem from './ListItem';

const ItemTypes = {
    LIST_ITEM: 'listItem',
    };
const ListContainer = () => {
  const [items, setItems] = useState(['Item 1', 'Item 2', 'Item 3']);
  const [draggedItem, setDraggedItem] = useState(null);

  const [, drop] = useDrop({
    accept: ItemTypes.LIST_ITEM,
    drop: () => {
      // Update the list when an item is dropped
      if (draggedItem) {
        const updatedItems = [...items];
        const fromIndex = items.indexOf(draggedItem.text);
        const toIndex = items.indexOf(draggedItem.hoveredOver);
        updatedItems.splice(fromIndex, 1);
        updatedItems.splice(toIndex, 0, draggedItem.text);
        setItems(updatedItems);
        setDraggedItem(null);
      }
    },
  });

  const moveItem = (text) => {
    setDraggedItem({ text, hoveredOver: null });
  };

  const hoverItem = (text) => {
    setDraggedItem({ text, hoveredOver: text });
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div style={{ width: '300px', margin: 'auto' }}>
        {items.map((item, index) => (
          <ListItem key={index} text={item} moveItem={moveItem} hoverItem={hoverItem} />
        ))}
        <div ref={drop} style={{ marginTop: '8px', border: '1px dashed #ccc', padding: '8px' }}>
          Drop Zone
        </div>
      </div>
    </DndProvider>
  );
};

export default ListContainer;
