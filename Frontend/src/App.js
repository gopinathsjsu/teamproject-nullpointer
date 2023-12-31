import { RouterProvider, createBrowserRouter, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

import { login } from "./Redux/userReducer";
import Dashboard from './Views/Dashboard/Dashboard';
import Login from './Views/Login/Login';
import Register from './Views/Register/Register';
import AccountInfo from './Views/AccountInfo/AccountInfo';
import Navbar from './Components/Navbar/Navbar';
import Checkout from './Views/Checkout/Checkout';
import Payment from './Views/Payment/Payment';
import Admin from './Views/Admin/Admin';
import { host } from './env';

import './Styles/index.scss'
import Ticket from './Views/Ticket/Ticket';
import Loader from './Components/Loader/Loader';

const router = (user) => createBrowserRouter([
  {
    path: "/",
    element: navBarWrapper(<Dashboard />),
  },
  {
    path: "/login",
    element: navBarWrapper(<Login />),
  },
  {
    path: "/register",
    element: navBarWrapper(<Register />),
  },
  {
    path: "/account",
    element: user?  navBarWrapper(<AccountInfo />): <Navigate to="/"/>,
  },
  {
    path: '/checkout/:id',
    element: navBarWrapper(<Checkout />)
  },
  {
    path: '/payment',
    element: navBarWrapper(<Payment />)
  },
  {
    path: '/admin',
    element: user?.isAdmin? navBarWrapper(<Admin />) : <Navigate to="/" />,
  },
  {
    path: '/ticket/:ticketId/:showtimeId',
    element: navBarWrapper(<Ticket />),
  }
]);

const navBarWrapper = (element) => (
  <>
    <Navbar/>
    {element}
  </>
)

const App = () => {
  const[ loading, setLoading ] = useState(false);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state);
  const userToken = localStorage.getItem('x-access-token')? jwtDecode(localStorage.getItem('x-access-token')) : '';
  
  useEffect(() => {
    if(!user?.id && localStorage.getItem('x-access-token')){
      setLoading(true);
      fetch(`${host}/api/user`, {
        method: "GET",
        headers: { 
          "Content-Type": "application/x-www-form-urlencoded",
          'x-access-token': localStorage.getItem('x-access-token') 
        },
      }).then((resp) => resp.json())
      .then((data) => {
        dispatch((login(data.user_data)));
        setLoading(false);
      })
    }else
      setLoading(false);
  }, []);

  return (
    <>
    {
      loading?
      <Loader /> : <RouterProvider router={router(userToken)} />
    }
    </>
  );
}

export default App;
