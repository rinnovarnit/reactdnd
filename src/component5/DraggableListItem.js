import React, { useState,useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import AddElementForm from './AddElementForm';

const ItemTypes = {
  NOTE: 'listItem',
};

const DraggableListItem = (props) => {
  // console.log("DraggableListItem props ===>",props);
  const { item, moveItem, addChildElement, removeElement, items, setItems, editItem, addElement } = props
  const {id,parentId,label,child} = item
  const [showAddChildInput, setShowAddChildInput] = useState(false)
  const [showAddElementInput, setShowAddElementInput] = useState(false)
  const [editMode, setEditMode] = useState(false)

  const ref = useRef(null);

  const [{ isDragging }, drag, preview] = useDrag({
    type: ItemTypes.NOTE,
    item: item,
    collect: monitor => ({
      isDragging: monitor.isDragging()
    })
  });

  const [, drop] = useDrop({
    accept: ItemTypes.NOTE,
   
    hover: (draggedItem, monitor) => {
      let flag = true

      const canDrop = (draggedItem, dropItemId,flag) => {
        if (draggedItem.id == dropItemId) {
          flag = false
          return flag
        }
        if (draggedItem.child && draggedItem.child.length>0) {
          draggedItem.child.forEach(childItem =>{
            flag = canDrop(childItem, dropItemId,flag)
            if(flag==false)
              return flag
          })
        }
        console.log("flag3==>", flag);
        return flag
      }

      const hoverBoundingRect = ref.current.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      flag = canDrop(draggedItem, id,flag)

      if (!flag) {
        console.log('cannot drop into its own child')
      }
      else{
        console.log("canDrop");
        if (draggedItem.id !== id) {
          moveItem(draggedItem, item);
        }
      }
    },
  });

  const handleAddElement = (event, dropItem) => {
    event.preventDefault()
    const {id,parentId} = dropItem
    const inputValue = event.target.elements['element-input'].value
    let element = {
      id: Math.floor(Math.random() * 1000000),
      position: 2,
      label: inputValue,
      parentId: parentId,
      archived: 'false'
    }
    setShowAddElementInput(false)
    let updatedItems = addElement(element, id)
    setItems(updatedItems)

  }

  const handleAddChildElement = (event, dropItem) => {
    event.preventDefault()
    const {id} = dropItem.id
    const inputValue = event.target.elements['element-input'].value
    let child = {
      id: Math.floor(Math.random() * 1000000),
      position: 2,
      label: inputValue,
      parentId: id,
      archived: 'false'
    }
    console.log("created child ===> ", child);
    setShowAddChildInput(false)
    let updatedItems = addChildElement(child, items)
    setItems(updatedItems)

  }

  const handleDeleteElement = (event, id) => {
    console.log("delete id ===>", id);
    let removeResultObject = removeElement(id)
    console.log("removeResultObject===>", removeResultObject);
    let updatedItems = removeResultObject.updatedItems
    console.log("imp after remove list======>", updatedItems);
    setItems(updatedItems)
    alert(`removed ${removeResultObject.removedObject.label}`)
  }

  const handleEditElement = (e, id) => {
    e.preventDefault()
    let updatedItems = editItem(e, id)
    setItems(updatedItems)
  }

  return (
    <div className='container'>
      <div className='element-contiainer'
      style={{
              opacity: isDragging ? 0.7 : 1,
            }}
      >
        <div className='element' 
        ref={(node) => !isDragging && drop(node)}
                
        style={{
          cursor: 'pointer',
          padding: '8px',
          border: '1px solid #ccc',
          marginBottom: '8px',
        }}>
          {editMode ?
            <AddElementForm
              handleForm={(e) => handleEditElement(e, id)}
              setShowAddChildInput={(value) => setEditMode(value => value)}
              label={label}
            />
            :
            <div style={{
              opacity: isDragging ? 0.7 : 1,
              border: '1px solid #ccc',

            }}
            >
              <div
              ref={node=>drag(node)}
              >
                {label}
              </div>
              <button className='add-child-button' onClick={() => setShowAddChildInput(true)}>+Add Child</button>
              <button className='delete-button' onClick={(e) => handleDeleteElement(e, item.id)}>-Delete</button>
              <button className='edit-button' onClick={(e) => setEditMode(true)}>Edit</button>
            </div>
          }
          <button className='add-element-button' onClick={(e) => setShowAddElementInput(true)}>Add Element</button>
        </div>


      </div>
      {showAddChildInput &&
        <AddElementForm
          handleForm={(e) => handleAddChildElement(e, id)}
          setShowInput={value => setShowAddChildInput(value)}
        />
      }
      {child && (
        <div style={{ 'marginLeft': '40px' }}>
          {child.map((item) => (
            <DraggableListItem
              key={Math.floor(Math.random() * 1000000)}
              item = {item}
              moveItem={(draggedItem,dropItem) => moveItem(draggedItem,dropItem)}
              items={items}
              setItems={(updatedItems) => setItems(updatedItems)}
              addChildElement={(child) => addChildElement(child)}
              removeElement={(id, parentId) => removeElement(id, parentId)}
              editItem={(e, id) => editItem(e, id)}
              addElement={(item, id) => addElement(item, id)}
            />
          ))}
        </div>
      )}
      {showAddElementInput &&
        <AddElementForm
          handleForm={(e) => handleAddElement(e,item)}
          setShowInput={value => setShowAddElementInput(value)}
        />
      }
    </div>
  );
};

export default DraggableListItem;