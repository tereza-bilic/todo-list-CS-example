import React, { useState, useEffect } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import TextField from '@mui/material/TextField';

const Todo = ({ todo, index, completeTodo, removeTodo }) => {

  return (
    <List>
      <ListItem button>
        <Checkbox
          checked={todo.completed}
          onClick={() => completeTodo(index)}
        />
        <ListItemText primary={todo.title} />
        <Button onClick={() => removeTodo(index)}>Delete</Button>
      </ListItem>
    </List>
  );
};

const TodoForm = ({ addTodo }) => {
  const [title, setTitle] = useState("");
  const [color, setColor] = useState("");
  const [date, setDate] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title) return;
    try {
      const response = await fetch("http://localhost:3001/todo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, completed: false, color, date }),
      });
      const data = await response.json();
      addTodo(data);
      setTitle("");
      setColor("");
      setDate("");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        label="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        margin="normal"
      />
      <TextField
        label="Color"
        value={color}
        onChange={(e) => setColor(e.target.value)}
        margin="normal"
      />
      <TextField
        label="Date"
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        InputLabelProps={{
          shrink: true,
        }}
        margin="normal"
      />
      <Button type="submit" variant="contained">
        Add Todo
      </Button>
    </form>
  );
};

const TodoList = () => {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3001/todos");
        const data = await response.json();
        setTodos(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  const addTodo = (todo) => {
    setTodos([...todos, todo]);
  };

  const completeTodo = (index) => {
    const newTodos = [...todos];
    newTodos[index].completed = !newTodos[index].completed;
    setTodos(newTodos);
  };

  const removeTodo = (index) => {
    const newTodos = [...todos];
    newTodos.splice(index, 1);
    setTodos(newTodos);
  };

  return (
    <div>
      {todos.map((todo, index) => (
        <Todo
          key={index}
          index={index}
          todo={todo}
          completeTodo={completeTodo}
          removeTodo={removeTodo}
        />
      ))}
      <TodoForm addTodo={addTodo} />
    </div>
  );
};

export default TodoList;
