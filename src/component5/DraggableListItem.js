import React, { useState, useRef, memo } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import AddElementForm from './AddElementForm';
import { Button, Input } from 'antd';
import { PauseCircleFilled } from "@ant-design/icons";
const ItemTypes = {
  NOTE: 'listItem',
};

let flag = false

const DraggableListItem = (props) => {
  // console.log("aq DraggableListItem", { item, moveItem, addChildrenElement, removeElement, items, setItems, editItem, addElement } );
  console.log("DraggableListItem props ===>", props);
  const { item, moveItem, addChildrenElement, removeElement, items, setItems, editItem, addElement, handleDropElement } = props
  const { id, parentId, label, children } = item
  const [showAddChildrenInput, setShowAddChildrenInput] = useState(false)
  const [showAddElementInput, setShowAddElementInput] = useState(false)
  // const [editMode, setEditMode] = useState(false)
  // const [removedDragIndex, setRemovedDragIndex] = useState(null);
  const [dropPosition, setDropPosition] = useState("")

  const ref = useRef(null);

  const [{ isDragging }, drag, preview] = useDrag({
    type: ItemTypes.NOTE,
    item: item,
    collect: monitor => ({
      isDragging: monitor.isDragging()
    })
  });

  const [{ isOver }, drop] = useDrop({
    accept: ItemTypes.NOTE,
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),

    drop: (draggedItem, monitor) => {
      console.log("aqpd dropped", draggedItem);
      let updatedItems = [...items]
      // new code
      updatedItems = handleDropElement(item, draggedItem, dropPosition)

      // old code
      // if (dropPosition) {
      //   updatedItems = addChildrenElement(draggedItem)
      // }
      // else {
      //   let dropItem = { ...item }
      //   updatedItems = handleDropElement(dropItem, draggedItem, updatedItems, removedDragIndex)
      // }
      setItems(updatedItems)
    },

    hover: (draggedItem, monitor) => {
      console.log("spd hover onnnn", draggedItem);
      if (!ref.current) {
        return;
      }
      console.log("ref====>", ref);
      const canNotDrop = (draggedItem, dropItemId) => {
        if (draggedItem.id == dropItemId) {
          return true
        }
        else if (draggedItem.children && draggedItem.children.length > 0) {
          return draggedItem.children.some(childrenItem => {
            return canNotDrop(childrenItem, dropItemId)
          })
        }
        else {
          return false
        }

      }
      const hoveredItemDimensions = ref.current.getBoundingClientRect();
      const hoveredItemMiddleY = (hoveredItemDimensions.bottom - hoveredItemDimensions.top) / 2;
      const hoveredItemMiddleX = (hoveredItemDimensions.right - hoveredItemDimensions.left) / 2
      const dragPointerDimensions = monitor.getClientOffset();
      const dragPointerY = dragPointerDimensions.y - hoveredItemDimensions.top;
      const dragPointerX = dragPointerDimensions.x - hoveredItemDimensions.left

      console.log("awpts ref", ref)
      console.log("awpts hoveredItemDimensions", hoveredItemDimensions.top, dragPointerDimensions.y);
      console.log("awpts hoveredItemMiddleX", hoveredItemMiddleX);
      console.log("awpts hoveredItemMiddleY", hoveredItemMiddleY);
      console.log("awpts dragPointerDimensions", dragPointerDimensions);
      console.log("awpts dragPointerX", dragPointerX);
      console.log("awpts dragPointerY", dragPointerY);

      flag = canNotDrop(draggedItem, id, flag)

      if (flag) {
        console.log('spd cannot drop into its own children')
      }
      else {
        console.log("spd can Drop");
        if (draggedItem.id !== id) {
          //new code
          if (dragPointerY < hoveredItemMiddleY) {
            if (dropPosition != "addBefore") {
              setDropPosition(value => "addBefore")
            }
          }
          else if (dragPointerX > hoveredItemMiddleX) {
            if (dropPosition != "addChild") {
              setDropPosition(value => "addChild")
            }
          }
          else {
            if (dropPosition != "addAfter") {
              setDropPosition(value => "addAfter")
            }
          }
          console.log("aq dropPosition", dropPosition);
          let dropItem = { ...item }
          let fromId = draggedItem.id
          let toId = dropItem.id
          let dragParentId = draggedItem.parentId
          let dropParentId = dropItem.parentId
          console.log(`fromId: ${fromId}, toId: ${toId}, dragParentId : ${dragParentId}, dropParentId: ${dropParentId}`);
          let updatedItems = [...items];
          const removeDrag = removeElement(draggedItem.id)
          console.log("removeDrag", removeDrag);
          updatedItems = [...removeDrag.updatedItems]
          setItems(updatedItems)

          // old code
          // if ((dragPointerY > hoveredItemMiddleY) && (dragPointerX < hoveredItemMiddleX) ) {
          //   if (dropPosition) {
          //     setDropPosition(false)
          //   }
          //   console.log("aq rearrange");
          //   // moveItem(draggedItem, item);
          //   let dropItem = { ...item }
          //   let fromId = draggedItem.id
          //   let toId = dropItem.id
          //   let dragParentId = draggedItem.parentId
          //   let dropParentId = dropItem.parentId
          //   console.log(`fromId: ${fromId}, toId: ${toId}, dragParentId : ${dragParentId}, dropParentId: ${dropParentId}`);
          //   let updatedItems = [...items];
          //   const removeDrag = removeElement(fromId, dragParentId, updatedItems)
          //   console.log("removeDrag", removeDrag);
          //   updatedItems = [...removeDrag.updatedItems]
          //   setItems(updatedItems)
          //   setRemovedDragIndex(removeDrag.removedObjectIndex)
          // }
          // else if((dragPointerY > hoveredItemMiddleY) && (dragPointerX > hoveredItemMiddleX)) {
          //   setDropPosition(true)
          //   console.log("aq make");
          //   draggedItem.parentId = id
          //   let removeResultObject = removeElement(draggedItem.id)
          //   console.log("removeResultObject===>", removeResultObject);
          //   let updatedItems = removeResultObject.updatedItems
          //   setItems(updatedItems)
          // }
        }
      }
    },
  });
  // console.log("aq dropPosition", dropPosition, isOver);

  const handleAddElement = (event, item) => {
    event.preventDefault()
    const { id, parentId } = item
    const inputValue = event.target.elements['element-input'].value
    let element = {
      id: Math.floor(Math.random() * 1000000),
      position: 2,
      label: inputValue,
      parentId: parentId,
      archived: 'false'
    }
    console.log("aq", element);
    let updatedItems = addElement(element, id)
    console.log("aq updated items after addElement", updatedItems);
    setItems(updatedItems)
    // setItems((items) => addElement(element, id));
    setShowAddElementInput(false)

  }

  const handleAddChildrenElement = (event, item) => {
    event.preventDefault()
    const id = item.id
    const inputValue = event.target.elements['element-input'].value
    let children = {
      id: Math.floor(Math.random() * 1000000),
      position: 2,
      label: inputValue,
      parentId: id,
      archived: 'false'
    }
    console.log("created children ===> ", children);
    setShowAddChildrenInput(false)
    let updatedItems = addChildrenElement(children)
    setItems(updatedItems)
    // setItems((items) => addChildrenElement(children));
  }

  const handleDeleteElement = (id) => {
    const { updatedItems, removedObject } = removeElement(id);
    setItems(updatedItems);
    console.log("asdf", removedObject);
    alert(`Removed ${removedObject.label}`);
  }

  const handleEditElement = (inputValue, id) => {
    // console.log("handleEditCalled", inputValue);
    // let updatedItems = editItem(inputValue, id)
    // setItems(updatedItems)
    setItems((items) => editItem(inputValue, id, items));
  }

  return (
    <div className='container'>
      {
        // (isOver && dropPosition == "addBefore") &&
        // <div className={'shadow-container'}></div>
      }
      <div className='element-contiainer'
        ref={ref}
        style={{
          opacity: isDragging ? 0.7 : 1,
        }}
      >
      {
        (isOver && dropPosition == "addBefore") &&
        <div className={'shadow-container'}></div>
      }
        <PauseCircleFilled ref={node => drag(node)} className='pauseCircleFilled-tags' />
        <div className='element'
          ref={(node) => !isDragging && drop(node)}
        >
          <div
            ref={node => preview(node)}
          >
            <Input
              id={id}
              span={24}
              value={label}
              onChange={(e) => handleEditElement(e.target.value, id)}
            />
            <Button className='add-children-button' onClick={() => setShowAddChildrenInput(true)}>+Add Children</Button>
            <Button className='delete-button' onClick={(e) => handleDeleteElement(item.id)}>-Delete</Button>
            {
              // <Button className='edit-button' onClick={(e) => setEditMode(true)}>Edit</Button>
            }
          </div>
          <Button className='add-element-button' onClick={(e) => setShowAddElementInput(true)}>Add Element</Button>
        </div>
      </div>
      {isOver && (
        dropPosition === "addChild"
          ? <div className={'shadow-container child-shadow'}></div>
          : (dropPosition === "addAfter" && <div className={'shadow-container'}></div>)
      )}

      {showAddChildrenInput &&
        <AddElementForm
          handleForm={(e) => handleAddChildrenElement(e, item)}
          setShowInput={value => setShowAddChildrenInput(value)}
        />
      }
      {children && (
        <div style={{ 'marginLeft': '40px' }}>
          {children.map((item) => (
            <DraggableListItem
              // key={item.id+item.type}
              key={(item.id * 1000) + item.label}
              item={item}
              items={items}
              moveItem={(draggedItem, dropItem) => moveItem(draggedItem, dropItem)}
              setItems={(updatedItems) => setItems(updatedItems)}
              addChildrenElement={(children) => addChildrenElement(children)}
              removeElement={removeElement}
              editItem={(e, id) => editItem(e, id)}
              addElement={(item, id) => addElement(item, id)}
              handleDropElement={handleDropElement}
            />
          ))}
        </div>
      )}
      {showAddElementInput &&
        <AddElementForm
          handleForm={(e) => handleAddElement(e, item)}
          setShowInput={value => setShowAddElementInput(value)}
        />
      }
    </div>
  );
};

export default memo(DraggableListItem);