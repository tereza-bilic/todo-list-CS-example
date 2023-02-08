// pretend data is come from api
import React, { useState, useEffect, useRef } from 'react';
import TextField from '@mui/material/TextField';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';

const listApi = async () => {
  return await Promise.resolve([
    { id: 1, content: "Hola~", editable: false, checked: false },
    {
      id: 2,
      content: "Double click me can activate edit function~",
      editable: false,
      checked: false
    },
    {
      id: 3,
      content: 'Press "Toggle delete" button will show delete icons~',
      editable: false,
      checked: false
    },
    {
      id: 4,
      content:
        "Undo button can recover at most 20 items which recently been deleted...",
      editable: false,
      checked: false
    },
    {
      id: 5,
      content:
        "the recover item will back to the order it was",
      editable: false,
      checked: false
    },
  ]);
};

const TodoList = () => {
  const [listData, setListData] = useState([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [previousItems, setPreviousItems] = useState([]);

  const handleAddClick = () => {
    const lastItemId = lastIdGen();
    const newItem = {
      id: lastItemId + 1,
      content: "",
      editable: true,
      checked: false
    };
    listData.push(newItem);
    setListData([...listData]);
    setPreviousItems([...previousItems]);
  };

  const lastIdGen = () => {
    if (!listData.length && !previousItems.length) return 0;
    const currentItemIds = listData.length ? listData.map(item => item.id) : [];
    const previousItemsIds = previousItems.length
      ? previousItems.map(item => item.id)
      : [];

    return Math.max(...currentItemIds, ...previousItemsIds);
  };

  const previousItemsWithoutIndexGen = () => {
    if (!previousItems.length) return [];
    previousItems.forEach(item => delete item.index);
  };

  const handleDelete = id => {
    const idx = listData.findIndex(i => i.id === id);
    let removedItem = listData.splice(idx, 1)[0];
    removedItem.index = idx;
    addPreviousItems(removedItem);
    setListData([...listData]);
    setPreviousItems([...previousItems]);
  };

  const addPreviousItems = removedItem => {
    previousItems.push(removedItem);
    if (previousItems.length > 19) {
      previousItems.shift();
    }
  };

  const changeHandler = (e, item) => {
    const { name, value } = e.target;
    item[name] = value;
    setListData([...listData]);
  };

  const handleEdit = (item, editable,id) => {
    item.editable = editable;
    setListData([...listData]);
  };

  const handleCheck =  item=> {
    item.checked = !item.checked;
    setListData([...listData]);
  };

  const handleUndo = item => {
    if (!previousItems.length) return;
    const recoverItem = previousItems.pop();
    if (typeof recoverItem.index === "number") {
      listData.splice(recoverItem.index, 0, recoverItem);
    } else listData.push(recoverItem);

    setListData([...listData]);
    setPreviousItems([...previousItems]);
  };

  useEffect(() => {
    const fetchData = async () => {
      const data = await listApi();
      data.forEach(item => (item.inital = true));
      setListData(data);
    };
    fetchData();


  }, []);

  return (
    <Container component="main" maxWidth="m">
      <div className="top-btns">
        <button onClick={handleAddClick}>Add</button>
        {
          <button onClick={() => setIsDeleting(!isDeleting)}>
            Toggle Delete
          </button>
        }
        {<button onClick={handleUndo}>Undo</button>}
      </div>
      <div className="list">
        {listData.map(item => (
          <Box key={item.id} sx={{display: "flex", justifyContent: "space-between"}}>
            <div
              className={`checkbox ${item.checked ? "checked" : ""}`}
              onClick={()=> handleCheck(item)}
            >
              {item.checked ? <CheckBoxIcon /> : <CheckBoxOutlineBlankIcon />}
            </div>
            <div
              onDoubleClick={() => handleEdit(item, true)}
            >
              <TextField
                sx={{width: 3/3}}
                label="ToDo"
                name="content"
                value={item.content}
                onChange={e => changeHandler(e, item)}
                onBlur={e => handleEdit(item, false)}
              />
            </div>
            <div className="inside-btns">
              {<button onClick={() => handleDelete(item.id)}>X</button>}
            </div>
          </Box>
        ))}
      </div>
    </Container>
  );
};

export default TodoList;
