import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './Redux';
import Dashboard from './Views/Dashboard/Dashboard';
import Navbar from './Components/Navbar/Navbar';
import './Styles/index.scss'

const router = createBrowserRouter([
  {
    path: "/",
    element: <Dashboard />,
    
  },
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
