// ListItem.js
import React from 'react';
import { useDrag } from 'react-dnd';

const ItemTypes = {
  LIST_ITEM: 'listItem',
};

const ListItem = ({ text, moveItem }) => {
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.LIST_ITEM,
    item: { text },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag}
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: 'move',
        border: '1px solid #ccc',
        padding: '8px',
        marginBottom: '4px',
      }}
    >
      {text}
    </div>
  );
};

export default ListItem;
