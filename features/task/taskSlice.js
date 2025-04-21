import { createSlice,createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const apiUrl = "http://localhost:3000/api/tasks"

const headers = () => {
  const obj = {
    'Content-Type': 'application/json',
    'Authorization': `${localStorage.getItem("accessToken")}`
  }
  return obj
}

//create Task

export const createTask = createAsyncThunk("task/create", async(taskData) => {
  try {
    const response = await axios.post(`${apiUrl}`,taskData,{headers:headers()})
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

//fetch Task

export const fetchTask = createAsyncThunk("task/fetch", async() => {
  try {
    const response = await axios.get(`${apiUrl}`,{headers:headers()})
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
  tasks:[],
  taskCreateState: "idle",
  taskCreateMessage: null,
  taskCreateError: null,
  taskFetchState: "idle",
  taskFetchMessage: null,
  taskFetchError: null,
};


const taskSlice = createSlice({
  name: "taskState",
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {

    //task create

    builder.addCase(createTask.pending, (state) => {
    state.taskCreateState ="loading"
    })
    builder.addCase(createTask.fulfilled, (state,action) => {
      state.taskCreateState = "success"
      state.tasks = [...state.tasks,action.payload.newTask]
      state.taskCreateMessage = action.payload.message
      state.taskCreateError =null
    })
    builder.addCase(createTask.rejected, (state, action) => {
      state.taskCreateState = "reject"
      state.taskCreateError = action.error.message
      state.taskCreateMessage = null
    })

    // fetch task

     builder.addCase(fetchTask.pending, (state) => {
        state.taskFetchState ="loading"
        })
        builder.addCase(fetchTask.fulfilled, (state,action) => {
          state.taskFetchState = "success"
          state.tasks = action.payload
          state.taskFetchError =null
        })
        builder.addCase(fetchTask.rejected, (state, action) => {
          state.taskFetchState = "reject"
          state.taskFetchError = action.error.message
        })

  }
})

export default taskSlice.reducer

export const {} = taskSlice.actions