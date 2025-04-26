import { createSlice,createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const apiUrl = "https://workasanabe.vercel.app/api/report"

const headers = () => {
  const obj = {
    'Content-Type': 'application/json',
    'Authorization': `${localStorage.getItem("accessToken")}`
  }
  return obj
}



//fetch Task days left

export const fetchtotalDaysLeft = createAsyncThunk("leftDaysTask/fetch", async() => {
  try {
    const response = await axios.get(`${apiUrl}/pending`,{headers:headers()})
    return response.data
  }
  catch (error)
  {
    if (error.response.data.error)
    {
      throw new Error(error.response.data.error)
    }
    throw new Error(error.message)
  }
})


//fetch last week completed Task

export const fetchClosedTaskLastweek = createAsyncThunk("closedTasklastWeek/fetch", async() => {
  try {
    const response = await axios.get(`${apiUrl}/last-week`,{headers:headers()})
    return response.data
  }
  catch (error)
  {
    if (error.response.data.error)
    {
      throw new Error(error.response.data.error)
    }
    throw new Error(error.message)
  }
})


//fetch last week completed Task

export const fetchCompletedTaskByTeam = createAsyncThunk("completedByTeam/fetch", async() => {
  try {
    const response = await axios.get(`${apiUrl}/closed-tasks/teams`,{headers:headers()})
    return response.data
  }
  catch (error)
  {
    if (error.response.data.error)
    {
      throw new Error(error.response.data.error)
    }
    throw new Error(error.message)
  }
})

const initialState = {
  lastWeekCompletedTask: null,
  taskCompletedByTeams:[],
  taskDaysLeft:null,
  closedLWeekTaskState: "idle",
  closedLWeekMessage: null,
  closedLWeekError: null,
  TaskDaysLeftState: "idle",
  DaysLeftMessage: null,
  DaysLeftError: null,
};


const reportSlice = createSlice({
  name: "reportState",
  initialState,
  reducers: {

  },
  extraReducers: (builder) => {

    
    
    // fetch last week Closed task

     builder.addCase(fetchClosedTaskLastweek.pending, (state) => {
        state.closedLWeekTaskState ="loading"
        })
        builder.addCase(fetchClosedTaskLastweek.fulfilled, (state,action) => {
          state.closedLWeekTaskState = "success"
          state.lastWeekCompletedTask = action.payload.completedTask
          state.closedLWeekError = null
        })
        builder.addCase(fetchClosedTaskLastweek.rejected, (state, action) => {
          state.closedLWeekTaskState = "reject"
          state.closedLWeekError = action.error.message
        })

    // fetch last week Closed task

     builder.addCase(fetchtotalDaysLeft.pending, (state) => {
        state.TaskDaysLeftState ="loading"
        })
        builder.addCase(fetchtotalDaysLeft.fulfilled, (state,action) => {
          state.TaskDaysLeftState = "success"
          state.taskDaysLeft= action.payload.daysLeft
          state.DaysLeftError = null
        })
        builder.addCase(fetchtotalDaysLeft.rejected, (state, action) => {
          state.TaskDaysLeftState = "reject"
          state.DaysLeftError = action.error.message
        })
    
    
    
    // fetch completed task by team

     builder.addCase(fetchCompletedTaskByTeam.pending, (state) => {
        state.TaskDaysLeftState ="loading"
        })
        builder.addCase(fetchCompletedTaskByTeam.fulfilled, (state,action) => {
          state.TaskDaysLeftState = "success"
          state.taskCompletedByTeams = action.payload.team
          state.DaysLeftError = null
        })
        builder.addCase(fetchCompletedTaskByTeam.rejected, (state, action) => {
          state.TaskDaysLeftState = "reject"
          state.DaysLeftError = action.error.message
        })
    
    
    
  }
})

export default reportSlice.reducer

export const {} = reportSlice.actions