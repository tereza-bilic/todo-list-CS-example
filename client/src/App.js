import './App.css';
import RegistrationForm from './components/RegistrationForm/RegistrationForm';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import LoginForm from './components/LoginForm/LoginForm';
import TodoList from './components/TodoList/TodoList';

const router = createBrowserRouter([
  {
    path: "/register",
    element: <RegistrationForm />,
  },
  {
    path: "/",
    element: <LoginForm />,
  },
  {
    path: "/todo",
    element: <TodoList />
  }
]);


function App() {
  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
