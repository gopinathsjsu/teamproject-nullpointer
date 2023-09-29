import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './Redux';
import Dashboard from './Views/Dashboard/Dashboard';
import Login from './Views/Login/Login';
import Navbar from './Components/Navbar';
import './Styles/index.scss'

const router = createBrowserRouter([
  {
    path: "/",
    element: <Dashboard />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    //element: <Signup />
  }
]);

function App() {
  return (
    <Provider store={store}>
      <Navbar/>
      <RouterProvider router={router} />
    </Provider>
  );
}

export default App;
