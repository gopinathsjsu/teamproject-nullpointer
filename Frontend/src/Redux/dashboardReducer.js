import { createSlice } from '@reduxjs/toolkit'

export const dashboard = createSlice({
  name: 'dashboard',
  initialState: {},
  reducers: {
    setDashboard: (state, action) =>{
      const locations = [];
      const theaters = [];
      action?.payload?.forEach(location => {
        locations.push({
          id: location._id,
          name: location.name
        });
        location.theaters.forEach((theatre)=>{
          theaters.push({
            id: theatre._id,
            locationId: theatre.location_id,
            name: theatre.name,
            seating_capacity: theatre.seating_capacity,
          })
        })
      });
      state.locations = locations;
      state.theaters = theaters;
    },
    setSelectedTheaterInfo: (state, action) => {
      state.selectedTheaterInfo = action.payload
    },
    setSelectedLocationInfo: (state, action) => {
      state.selectedLocationInfo = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { 
  setDashboard, 
  setSelectedTheaterInfo, 
  setSelectedLocationInfo 
} = dashboard.actions

export default dashboard.reducer