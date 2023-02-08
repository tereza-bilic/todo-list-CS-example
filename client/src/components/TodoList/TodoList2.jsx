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
          checked={0}
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

  const addTodo = (todo) => {
    setTodos([...todos, todo]);
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
      const data = await response.json();
      setTodos([
        ...todos.slice(0, index),
        data,
        ...todos.slice(index + 1),
      ]);
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
    <div>
      <h1>Todo List</h1>
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
  );
}

export default TodoList;
