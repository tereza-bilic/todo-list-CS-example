import './App.css';
import RegistrationForm from './components/RegistrationForm/RegistrationForm';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import LoginForm from './components/LoginForm/LoginForm';
import TodoList2 from './components/TodoList/TodoList2';

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
    element: <TodoList2 />
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
