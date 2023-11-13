import { RouterProvider, createBrowserRouter, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';

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

const router = (user) => createBrowserRouter([
  {
    path: "/",
    element: <Dashboard />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />
  },
  {
    path: "/account",
    element: user?.isMember?  <AccountInfo />: <Navigate to="/"/>,
  },
  {
    path: '/checkout',
    element: <Checkout />
  },
  {
    path: '/payment',
    element: <Payment />
  },
  {
    path: '/admin',
    element: user?.isAdmin? <Admin /> : <Navigate to="/" />,
  }
]);

const App = () => {
  const { user } = useSelector((state) => state);
  const dispatch = useDispatch();

  useEffect(() => {
    // fetch(`${host}/api/user_details`, {
    //   method: "GET",
    //   headers: { 
    //     "Content-Type": "application/x-www-form-urlencoded",
    //     'x-access-token': localStorage.getItem('x-access-token') 
    //   },
    // }).then((resp) => resp.json())
    // .then((data) => {
    //   dispatch((login(data)));
    // })
    dispatch(login({id:"655080ff20b140bcca6489d3",
    isAdmin:false,
    isMember:false,
    points:0,
    username:"admin"}))
  }, []);

  return (
    <>
      <Navbar/>
      <RouterProvider router={router(user)} />
    </>
  );
}

export default App;
