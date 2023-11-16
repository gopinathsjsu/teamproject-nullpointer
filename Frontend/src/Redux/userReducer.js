import { createSlice } from '@reduxjs/toolkit'

export const user = createSlice({
  name: 'user',
  initialState: {},
  reducers: {
    login: (_, action) =>{
      const user = {
        ...action.payload,
        id: action.payload._id,
      }
      delete user._id;
      return user;
    }
  },
})

// Action creators are generated for each case reducer function
export const { login } = user.actions

export default user.reducer