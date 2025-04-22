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


//task delete

export const deleteTask = createAsyncThunk("task/delete", async(taskId) => {
  try {
    const response = await axios.delete(`${apiUrl}/${taskId}`,{headers:headers()})
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


//completed Task update

export const completedTaskUpdate = createAsyncThunk("taskCompleted/update", async (updatedData) => {
  
  console.log(updatedData)

  try {
    const response = await axios.post(`http://localhost:3000/api/tasks/complete/${updatedData.id}`,updatedData,{headers:headers()})
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

export const fetchTask = createAsyncThunk("task/fetch", async(query) => {
  try {
    const response = await axios.get(`${apiUrl}${query||""}`,{headers:headers()})
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

//fetch task by Id


export const fetchTaskbyId = createAsyncThunk("taskbyId/fetch", async(taskId) => {
  try {
    const response = await axios.get(`${apiUrl}/${taskId}`,{headers:headers()})
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
  tasks: [],
  tasksById:null,
  taskCreateState: "idle",
  taskCreateMessage: null,
  taskCreateError: null,
  taskFetchState: "idle",
  taskFetchMessage: null,
  taskFetchError: null,
  taskbyIdFetchState: "idle",
  taskbyIdFetchMessage: null,
  taskbyIdFetchError: null,
  taskCompUpdateState: "idle",
  taskCompUpdateError: null,
   taskDeleteState: "idle",
  taskDeleteMessage: null,
  taskDeleteError: null,
};


const taskSlice = createSlice({
  name: "taskState",
  initialState,
  reducers: {
     resetTaskCreateMessage: (state) => {
      state.taskCreateMessage = null
      state.taskCreateError = null
    },
    clearTask: (state) => {
      state.tasks =[]
    }
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
        
     // project Tasks
        
     builder.addCase(fetchTaskbyId.pending, (state) => {
           state.taskFetchState ="loading"
           })
           builder.addCase(fetchTaskbyId.fulfilled, (state,action) => {
             state.taskbyIdFetchState = "success"
             state.tasksById = action.payload
             state.taskbyIdFetchError =null
           })
           builder.addCase(fetchTaskbyId.rejected, (state, action) => {
             state.taskbyIdFetchState = "reject"
             state.taskbyIdFetchError = action.error.message
           })
    
    //completed Task update
    
     builder.addCase(completedTaskUpdate.pending, (state) => {
           state.taskCompUpdateState ="loading"
           })
    builder.addCase(completedTaskUpdate.fulfilled, (state, action) => {
             console.log(action.payload)
             state.taskCompUpdateState = "success"
             state.tasksById = action.payload.updatedTask
             state.taskCompUpdateError =null
           })
           builder.addCase(completedTaskUpdate.rejected, (state, action) => {
             state.taskCompUpdateState = "reject"
             state.taskCompUpdateError = action.error.message
           })
    
    //delete Task
    
    builder.addCase(deleteTask.pending, (state) => {
    state.taskDeleteState ="loading"
    })
    builder.addCase(deleteTask.fulfilled, (state,action) => {
      state.taskDeleteState = "success"
      state.tasks = state.tasks.filter((task)=>task._id !== action.payload.deletedTask._id)
      state.taskDeleteMessage = action.payload.message
      state.taskDeleteError =null
    })
    builder.addCase(deleteTask.rejected, (state, action) => {
      state.taskDeleteState = "reject"
      state.taskDeleteError = action.error.message
      state.taskDeleteMessage = null
    })

  }
})

export default taskSlice.reducer

export const {resetTaskCreateMessage,clearTask} = taskSlice.actions