import React, { useEffect, useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import DraggableListItem from "./DraggableListItem";

const DraggableList = () => {
  const [items, setItems] = useState([]);
  const data = [
    {
      id: 1,
      position: 1,
      level: 1,
      label: "0-0",
      parentId: null,
      children: [
        {
          id: 2,
          position: 1,
          level: 2,
          label: "0-0-0",
          parentId: 1,
          children: [
            {
              id: 3,
              position: 1,
              level: 3,
              label: "0-0-0-0",
              parentId: 2,
              archived: "false",
            },
            {
              id: 4,
              position: 2,
              level: 3,
              label: "0-0-0-1",
              parentId: 2,
              archived: "false",
            },
            {
              id: 5,
              position: 3,
              level: 3,
              label: "0-0-0-2",
              parentId: 2,
              archived: "false",
            },
          ],
        },
        {
          id: 6,
          position: 2,
          level: 2,
          label: "0-0-1",
          parentId: 1,
          archived: "false",
        },
        {
          id: 7,
          position: 3,
          level: 2,
          label: "0-0-2",
          parentId: 1,
          archived: "false",
        },
      ],
    },
    {
      id: 8,
      position: 2,
      level: 1,
      label: "0-1",
      parentId: null,
      archived: "false",
    },
  ];

  useEffect(() => {
    setItems((value) => [...data]);
  }, []);

  console.log("aqpd DraggableList", items);
  //new code
  const handleDropElement = (dropItem, dragItem, dropPosition, items) => {
    console.log("aqpd dropPosition", {
      dropItem,
      dragItem,
      dropPosition,
      items,
    });
    let dropId = dropItem.id;
    let updatedItems = [...items];
    for (let i = 0; i < updatedItems.length; i++) {
      if (updatedItems[i].id == dropId) {
        console.log("handleDropElement condition matched");
        let parentId = updatedItems[i].parentId;
        dragItem.parentId = parentId;
        if (dropPosition === "addAfter") {
          updatedItems.splice(i + 1, 0, dragItem);
        } else if (dropPosition === "addBefore") {
          updatedItems.splice(i, 0, dragItem);
        } else if (dropPosition === "addChild") {
          dragItem.parentId = dropId;
          updatedItems = addChildrenElement(dragItem, items);
        }
        return updatedItems;
      }
      if (updatedItems[i].children) {
        updatedItems[i].children = handleDropElement(
          dropItem,
          dragItem,
          dropPosition,
          updatedItems[i].children
        );
      }
    }
    return updatedItems;
  };
  //old code
  // const handleDropElement=(dropObj,dragObj,items, removedDragIndex)=>{
  //   let dropId = dropObj.id
  //   let dragId = dragObj.id
  //   let sameParent = dragObj.parentId == dropObj.parentId
  //   let updatedItems = [...items]
  //   for(let i=0;i<updatedItems.length;i++){
  //     if(updatedItems[i].id==dropId){
  //       console.log("handleDropElement condition matched");
  //       let parentId = updatedItems[i].parentId
  //       dragObj.parentId = parentId
  //       console.log("removedDragIndex===>",removedDragIndex,i,sameParent);
  //       if(sameParent && removedDragIndex<=i)
  //         updatedItems.splice(i+1,0,dragObj)
  //       else{
  //         updatedItems.splice(i,0,dragObj)
  //       }
  //       return updatedItems
  //     }
  //     if(updatedItems[i].children){
  //       updatedItems[i].children = handleDropElement(dropObj,dragObj,updatedItems[i].children,removedDragIndex)
  //     }
  //   }
  //   return updatedItems;
  // }
  const addElement = (item, id, items) => {
    let updatedItems = [...items];

    for (let i = 0; i < updatedItems.length; i++) {
      if (updatedItems[i].id == id) {
        updatedItems.splice(i + 1, 0, item);
        console.log("aq condition mathed", id, item, i, updatedItems);
        return updatedItems;
      }
      if (updatedItems[i].children) {
        updatedItems[i].children = addElement(
          item,
          id,
          updatedItems[i].children
        );
      }
    }
    return updatedItems;
  };

  const addChildrenElement = (children, items) => {
    console.log("indside add element", children);
    console.log("children ===> ", children);
    console.log("items ===> ", items);
    let updatedItems = [...items];

    for (let i = 0; i < updatedItems.length; i++) {
      if (updatedItems[i].id == children.parentId) {
        console.log("condition mathed");
        if (!updatedItems[i].children) {
          updatedItems[i].children = [];
        }
        if (
          !updatedItems[i].children
            .map((childrenItem) => childrenItem.id)
            .includes(children.id)
        )
          updatedItems[i].children = [children, ...updatedItems[i].children];
        return updatedItems;
      }
      updatedItems[i].children &&
        addChildrenElement(children, updatedItems[i].children);
    }
    console.log("latest updated items===> ", items);
    return updatedItems;
  };

  const removeElement = (id, items) => {
    console.log("removeElement ===>", items);
    let updatedItems = [...items];
    let removedObject = {};
    let removedObjectIndex = null;

    for (let i = 0; i < updatedItems.length; i++) {
      if (updatedItems[i].id == id) {
        console.log("aq remove condition mathed", updatedItems[i]);
        [removedObject] = updatedItems.splice(i, 1);
        console.log("removedObject==>", removedObject, removedObject);
        removedObjectIndex = i;
        console.log(
          "removedDragIndex just after assigned===>",
          removedObjectIndex
        );
        // console.log("aq flag2===>", flag)
        return {
          updatedItems: [...updatedItems],
          removedObject: removedObject,
          removedObjectIndex: removedObjectIndex,
        };
      }
      if (updatedItems[i].children) {
        let tempObj = removeElement(id, updatedItems[i].children);
        if (tempObj) {
          updatedItems[i].children = tempObj.updatedItems;
          removedObject = tempObj.removedObject;
          removedObjectIndex = tempObj.removedObjectIndex;
        }
      }
    }
    // console.log("aq flag===>", flag)
    // if(flag==true){
    console.log(
      "removedDragIndex just after assigned2===>",
      removedObjectIndex
    );
    return {
      updatedItems: [...updatedItems],
      removedObject: removedObject,
      removedObjectIndex: removedObjectIndex,
    };
    // }
  };

  const editItem = (inputValue, id, items) => {
    let updatedItems = [...items];

    for (let i = 0; i < updatedItems.length; i++) {
      if (updatedItems[i].id == id) {
        console.log("condition mathed");
        updatedItems[i].label = inputValue;
        return updatedItems;
      }
      if (updatedItems[i].children)
        updatedItems[i].children = editItem(
          inputValue,
          id,
          updatedItems[i].children
        );
      // editItem(inputValue, id, updatedItems[i].children)
    }
    return updatedItems;
  };

  const moveItem = (draggedItem, dropItem, items) => {
    console.log("aq dropItem", dropItem);
    let fromId = draggedItem.id;
    let toId = dropItem.id;
    let dragParentId = draggedItem.parentId;
    let dropParentId = dropItem.parentId;
    console.log(
      `fromId: ${fromId}, toId: ${toId}, dragParentId : ${dragParentId}, dropParentId: ${dropParentId}`
    );
    let updatedItems = [...items];
    const removeDrag = removeElement(fromId, dragParentId, updatedItems);
    console.log("removeDrag", removeDrag);
    updatedItems = [...removeDrag.updatedItems];
    // updatedItems = handleDropElement(dropItem,removeDrag.removedObject,updatedItems, removeDrag.removedObjectIndex)
    return removeDrag;
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div style={{ width: "300px", margin: "auto" }}>
        {items.map((item) => (
          <DraggableListItem
            // key={item.id+item.type}
            key={item.id * 1000 + item.label}
            item={item}
            moveItem={(draggedItem, dropItem) =>
              moveItem(draggedItem, dropItem, items)
            }
            items={items}
            setItems={(updatedItems) => setItems((value) => updatedItems)}
            addChildrenElement={(children) =>
              addChildrenElement(children, items)
            }
            removeElement={(id) => removeElement(id, items)}
            editItem={(inputValue, id) => editItem(inputValue, id, items)}
            addElement={(item, id) => addElement(item, id, items)}
            handleDropElement={(dropItem, dragItem, dropPosition) =>
              handleDropElement(dropItem, dragItem, dropPosition, items)
            }
          />
        ))}
      </div>
    </DndProvider>
  );
};

export default DraggableList;
