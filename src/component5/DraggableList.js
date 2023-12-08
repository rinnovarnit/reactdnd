import React, { useEffect, useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import DraggableListItem from './DraggableListItem';

const DraggableList = () => {
  const [items, setItems] = useState([]);
  const data = [
    {
      id: 1,
      position: 1,
      level: 1,
      label: '0-0',
      parentId: null,
      child: [
        {
          id: 2,
          position: 1,
          level: 2,
          label: '0-0-0',
          parentId: 1,
          child: [
            {
              id: 3,
              position: 1,
              level: 3,
              label: '0-0-0-0',
              parentId: 2,
              archived: 'false'
            },
            {
              id: 4,
              position: 2,
              level: 3,
              label: '0-0-0-1',
              parentId: 2,
              archived: 'false'
            },
            {
              id: 5,
              position: 3,
              level: 3,
              label: '0-0-0-2',
              parentId: 2,
              archived: 'false'
            }
          ]
        },
        {
          id: 6,
          position: 2,
          level: 2,
          label: '0-0-1',
          parentId: 1,
          archived: 'false'
        },
        {
          id: 7,
          position: 3,
          level: 2,
          label: '0-0-2',
          parentId: 1,
          archived: 'false'
        }
      ]
    },
    {
      id: 8,
      position: 2,
      level: 1,
      label: '0-1',
      parentId: null,
      archived: 'false'
    }
]
  
  useEffect(()=>{
    setItems(value=>[...data])
  },[])
  
  
  const handleDropElement=(dropObj,dragObj,items, removedDragIndex)=>{
    let dropId = dropObj.id
    let dragId = dragObj.id
    let sameParent = dragObj.parentId == dropObj.parentId
    let updatedItems = [...items]
    for(let i=0;i<updatedItems.length;i++){
      if(updatedItems[i].id==dropId){
        console.log("handleDropElement condition matched");
        let parentId = updatedItems[i].parentId
        dragObj.parentId = parentId
        console.log("removedDragIndex===>",removedDragIndex,i,sameParent);
        if(sameParent && removedDragIndex<=i)
          updatedItems.splice(i+1,0,dragObj)
        else{
          updatedItems.splice(i,0,dragObj)
        }
        return updatedItems
      }
      if(updatedItems[i].child){
        updatedItems[i].child = handleDropElement(dropObj,dragObj,updatedItems[i].child,removedDragIndex)
      }
    } 
    return updatedItems;
    
  }
  const addElement = (item, id, items) => {
    let updatedItems = [...items]

    for (let i = 0; i < updatedItems.length; i++) {
      if (updatedItems[i].id == id) {
        console.log("condition mathed");
        updatedItems.splice(i+1,0,item)
        setItems(updatedItems)
        return updatedItems;
      }
      updatedItems[i].child && addElement(item,id, updatedItems[i].child)
    }
    return updatedItems
  }

  const addChildElement = (child, items) => {
    console.log("indside add element", child);
    console.log("child ===> ", child);
    console.log("items ===> ", items);
    let updatedItems = [...items]

    for (let i = 0; i < updatedItems.length; i++) {
      if (updatedItems[i].id == child.parentId) {
        console.log("condition mathed");
        if (!updatedItems[i].child) {
          updatedItems[i].child = []
        }
        updatedItems[i].child = [child, ...updatedItems[i].child]
        setItems(updatedItems)
        return updatedItems;
      }
      updatedItems[i].child && addChildElement(child, updatedItems[i].child)
    }
    console.log("latest updated items===> ", items);
    return updatedItems
  }

  

  const removeElement = (id, parentId, items) => {
    console.log("removeElement -- items===>", items);
    let updatedItems = [...items]
    let removedObject = {}
    let removedObjectIndex = null

    for (let i = 0; i < updatedItems.length; i++) {
      if (updatedItems[i].id == id) {
        console.log("condition mathed");
        [removedObject] = updatedItems.splice(i, 1)
        console.log("removedObject==>", removedObject);
        removedObjectIndex = i
        console.log("removedDragIndex just after assigned===>",removedObjectIndex);
        return {updatedItems:[...updatedItems], removedObject:removedObject, removedObjectIndex: removedObjectIndex };
      }
      if (updatedItems[i].child){
        let tempObj = updatedItems[i].child && removeElement(id, parentId, updatedItems[i].child)
        if(tempObj){
          updatedItems[i].child = tempObj.updatedItems
          removedObject = tempObj.removedObject
          removedObjectIndex = tempObj.removedObjectIndex
        }
      }
    }
    console.log("removedDragIndex just after assigned2===>",removedObjectIndex);    
    return {updatedItems:[...updatedItems], removedObject:removedObject, removedObjectIndex: removedObjectIndex }
  }

  const editItem = (e, id, items) => {
    let updatedItems = [...items]

    for (let i = 0; i < updatedItems.length; i++) {
      if (updatedItems[i].id == id) {
        console.log("condition mathed");
        updatedItems[i].label = e.target.elements['element-input'].value

        return updatedItems;
      }
      if (updatedItems[i].child)
        updatedItems[i].child = updatedItems[i].child && editItem(e, id, updatedItems[i].child)
    }
    return updatedItems

  }



  const moveItem = (draggedItem,dropItem,items) => {
    let fromId = draggedItem.id
    let toId = dropItem.id
    let dragParentId = draggedItem.parentId
    let dropParentId = dropItem.dragParentId
    console.log(`fromId: ${fromId}, toId: ${toId}, dragParentId : ${dragParentId}, dropParentId: ${dropParentId}`);
    let updatedItems = [...items];
    const removeDrag = removeElement(fromId,dragParentId,updatedItems)
    console.log("removeDrag", removeDrag);
    updatedItems = [...removeDrag.updatedItems]
    updatedItems = handleDropElement(dropItem,removeDrag.removedObject,updatedItems, removeDrag.removedObjectIndex)
    setItems(updatedItems);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div style={{ width: '300px', margin: 'auto' }}>
        {items.map((item) => (
          <DraggableListItem
            key={Math.floor(Math.random() * 1000000)}
            item = {item}
            moveItem={(draggedItem,dropItem) => moveItem(draggedItem,dropItem,items)}
            items={items}
            setItems={(updatedItems) => setItems(value => updatedItems)}
            addChildElement={(child) => addChildElement(child, items)}
            removeElement={(id, parentId) => removeElement(id, parentId, items)}
            editItem={(e, id) => editItem(e, id, items)}
            addElement={(item,id)=>addElement(item,id,items)}
          />
        ))}
      </div>
    </DndProvider>
  );
};

export default DraggableList;
