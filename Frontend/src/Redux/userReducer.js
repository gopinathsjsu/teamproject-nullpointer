import { createSlice } from '@reduxjs/toolkit'

export const user = createSlice({
  name: 'user',
  initialState: {},
  reducers: {
    login: (_, action) =>{
      return action.payload
    }
  },
})

// Action creators are generated for each case reducer function
export const { login } = user.actions

export default user.reducer