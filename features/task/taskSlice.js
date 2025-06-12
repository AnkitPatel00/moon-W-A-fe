import { createSlice,createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const apiUrl = "https://moon-w-a-be.onrender.com/api/tasks"

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


//update Task

export const updateTask = createAsyncThunk("task/update", async(taskData) => {
  try {
    const response = await axios.post(`${apiUrl}/${taskData.taskId}`,taskData.updatedData,{headers:headers()})
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
    const response = await axios.post(`https://moon-w-a-be.onrender.com/api/tasks/complete/${updatedData.id}`,updatedData,{headers:headers()})
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


//fetch task by project Id

export const fetchTaskbyId = createAsyncThunk("taskbyId/fetch", async (projectId) => {
  try {
    const response = await axios.get(`${apiUrl}/${projectId}`, { headers: headers() })
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


//fetch task details by taskId

export const fetchTaskDetailsbyId = createAsyncThunk("taskDetailsbyId/fetch", async (taskId) => {
  try {
    const response = await axios.get(`${apiUrl}/taskDetails/${taskId}`, { headers: headers() })
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
  isTaskForm: false,
  isUpdateTask:false,
  tasksById:[],
  tasksDetailsById:null,
  taskCreateState: "idle",
  taskCreateMessage: null,
  taskCreateError: null,
  taskUpdateState: "idle",
  taskUpdateMessage: null,
  taskUpdateError: null,
  taskFetchState: "idle",
  taskFetchMessage: null,
  taskFetchError: null,
  taskbyIdFetchState: "idle",
  taskbyIdFetchMessage: null,
  taskbyIdFetchError: null,
  taskDetailsFetchState: "idle",
  taskDetailsMessage: null,
  taskDetailsError: null,
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
    },
    setisTaskForm: (state,action) => {
      state.isTaskForm = action.payload
       state.taskCreateMessage = null
      state.taskCreateError = null
    },
    setisUpdateTask: (state,action) => {
      state.isUpdateTask = action.payload
 state.taskUpdateMessage = null
      state.taskUpdateError = null
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

    //task update

    builder.addCase(updateTask.pending, (state) => {
    state.taskUpdateState ="loading"
    })
    builder.addCase(updateTask.fulfilled, (state,action) => {
      state.taskUpdateState = "success"
      state.taskUpdateMessage = action.payload.message
      state.taskUpdateError =null
    })
    builder.addCase(updateTask.rejected, (state, action) => {
      state.taskUpdateState = "reject"
      state.taskUpdateError = action.error.message
      state.taskUpdateMessage = null
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
    builder.addCase(fetchTaskbyId.fulfilled, (state, action) => {
             state.taskbyIdFetchState = "success"
             state.tasksById = action.payload
             state.taskbyIdFetchError =null
           })
           builder.addCase(fetchTaskbyId.rejected, (state, action) => {
             state.taskbyIdFetchState = "reject"
             state.taskbyIdFetchError = action.error.message
           })
    
    
    
     // Tasks details byId
        
     builder.addCase(fetchTaskDetailsbyId.pending, (state) => {
           state.taskDetailsFetchState ="loading"
           })
    builder.addCase(fetchTaskDetailsbyId.fulfilled, (state, action) => {
             state.taskDetailsFetchState = "success"
             state.tasksDetailsById = action.payload
             state.taskDetailsError =null
           })
           builder.addCase(fetchTaskDetailsbyId.rejected, (state, action) => {
             state.taskDetailsFetchState = "reject"
             state.taskDetailsError = action.error.message
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

export const {resetTaskCreateMessage,clearTask,setisTaskForm,setisUpdateTask} = taskSlice.actions