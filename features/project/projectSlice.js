import { createSlice,createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const apiUrl = "https://workasana.up.railway.app/api/projects"

const headers = () => {
  const obj = {
    'Content-Type': 'application/json',
    'Authorization': `${localStorage.getItem("accessToken")}`
  }
  return obj
}

//create project

export const createProject = createAsyncThunk("project/create", async(projectData) => {
  try {
    const response = await axios.post(`${apiUrl}`,projectData,{headers:headers()})
    
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


export const fetchProject = createAsyncThunk("project/fetch", async(query) => {
  try {
      const response = await axios.get(`${apiUrl}${query || ""}`, { headers: headers() })
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


export const fetchProjectForForm = createAsyncThunk("projectForFrom/fetch", async() => {
  try {
      const response = await axios.get(`${apiUrl}`, { headers: headers() })
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
  projects: [],
  projectsforForm: [],
  isProjectForm:false,
  projectCreateState: "idle",
  projectCreateMessage: null,
  projectCreateError: null,
  projectforFormState: "idle",
  projectforFormMessage: null,
  projectforFormError: null,
  projectFetchState: "idle",
  projectFetchMessage: null,
  projectFetchError: null,
};


const projectSlice = createSlice({
  name: "projectState",
  initialState,
  reducers: {
    resetprojectCreateMessage: (state) => {
      state.projectCreateMessage = null
      state.projectCreateError = null
    },
    setisProjectForm: (state,action) => {
      state.isProjectForm = action.payload
      state.projectCreateMessage = null
      state.projectCreateError = null
    },
    clearProjects: (state) => {
      state.projects = []
    }
  },
  extraReducers: (builder) => {

    //project create

    builder.addCase(createProject.pending, (state) => {
    state.projectCreateState ="loading"
    })
    builder.addCase(createProject.fulfilled, (state,action) => {
      state.projectCreateState = "success"
      state.projects = [...state.projects,action.payload.newProject]
      state.projectCreateMessage = action.payload.message
      state.projectCreateError =null
    })
    builder.addCase(createProject.rejected, (state, action) => {
      state.projectCreateState = "reject"
      state.projectCreateError = action.error.message
      state.projectCreateMessage = null
    })


    //fetch project

    builder.addCase(fetchProject.pending, (state) => {
    state.projectFetchState ="loading"
    })
    builder.addCase(fetchProject.fulfilled, (state, action) => {
      state.projectFetchState = "success"
      state.projects = action.payload
      state.projectFetchError =null
    })
    builder.addCase(fetchProject.rejected, (state, action) => {
      state.projectFetchState = "reject"
      state.projectFetchError = action.error.message
    })


    //fetch project for form

    builder.addCase(fetchProjectForForm.pending, (state) => {
    state.projectFetchState ="loading"
    })
    builder.addCase(fetchProjectForForm.fulfilled, (state,action) => {
      state.projectFetchState = "success"
      state.projectsforForm = action.payload
      state.projectFetchError =null
    })
    builder.addCase(fetchProjectForForm.rejected, (state, action) => {
      state.projectFetchState = "reject"
      state.projectFetchError = action.error.message
    })

  }
})

export default projectSlice.reducer

export const {resetprojectCreateMessage,setisProjectForm,clearProjects} = projectSlice.actions