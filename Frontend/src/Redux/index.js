import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userReducer';
import dashboardReducer from './dashboardReducer';

const store = configureStore({
  reducer:{
    user: userReducer,
    dashboard: dashboardReducer,
  }
})

export default store;