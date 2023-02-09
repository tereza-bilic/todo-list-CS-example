import React, { useState, useEffect } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';

const Todo = ({ todo, index, completeTodo, removeTodo }) => {

  return (
    <List>
      <ListItem button>
        <Checkbox
          checked={Boolean(todo.completed)}
          onClick={() => completeTodo(index)}
        />
        <ListItemText primary={todo.title} sx={Boolean(todo.completed) ? {textDecoration: "line-through"} : {}}/>
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

      addTodo();

      setTitle("");
      setColor("");
      setDate("");
    } catch (error) {
      console.error(error);
    }
  };

  return (
      <Box component="form" onSubmit={handleSubmit} sx={{display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "50px"}}>
        <TextField
          sx={{width: '50ch', m: 1}}
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          margin="normal"
          size="large"
        />
        <Button type="submit" variant="contained">
          Add Todo
        </Button>
      </Box>
  );
};

const TodoList = () => {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    const getTodos = async () => {
      try {
        const response = await fetch("http://localhost:3001/todos");
        const data = await response.json();
        setTodos(data);
      } catch (error) {
        console.error(error);
      }
    };
    getTodos();
  }, []);

  const addTodo = async (todo) => {
    const response2 = await fetch("http://localhost:3001/todos");
    const data2 = await response2.json();
    setTodos(data2);
  };

  const completeTodo = async (index) => {
    const todo = todos[index];
    try {
      const response = await fetch(`http://localhost:3001/todo/${todo.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...todo, completed: !todo.completed }),
      });

      //re get todos after update
      const response2 = await fetch("http://localhost:3001/todos");
      const data2 = await response2.json();
      setTodos(data2);
    } catch (error) {
      console.error(error);
    }
  };

  const removeTodo = async (index) => {
    const todo = todos[index];
    try {
      await fetch(`http://localhost:3001/todo/${todo.id}`, {
        method: "DELETE",
      });
      setTodos([
        ...todos.slice(0, index),
        ...todos.slice(index + 1),
      ]);
      //re get todos
      const response = await fetch("http://localhost:3001/todos");
      const data = await response.json();
      setTodos(data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <div>
        <TodoForm addTodo={addTodo} />
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
        </div>
      </div>
    </Container>
  );
}

export default TodoList;
