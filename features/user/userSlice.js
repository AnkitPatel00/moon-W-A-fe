import { createSlice,createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const apiUrl = "https://workasanabe.vercel.app/api/auth"

export const signupUser = createAsyncThunk("user/signup", async(userData) => {
  try {
    const response = await axios.post(`${apiUrl}/signup`,userData,{headers:{'Content-Type':'application/json'}})
    
    
    return response.data
  }
  catch (error)
  {
    console.log(error.response.data.error)
    if (error.response.data.error)
    {
      throw new Error(error.response.data.error)
    }
    throw new Error(error.message)
     
  }
})


export const loginUser = createAsyncThunk("user/login", async(userData) => {
  try {
    const response = await axios.post(`${apiUrl}/login`,userData,{headers:{'Content-Type':'application/json'}})
    
    return response.data
  }
  catch (error)
  {
    console.log(error.response.data.error)
    if (error.response.data.error)
    {
      throw new Error(error.response.data.error)
    }

    throw new Error(error.message)
     
  }
})


const headers = () => {
  const obj = {
    'Content-Type': 'application/json',
    'Authorization': `${localStorage.getItem("accessToken")}`
  }
  return obj
}


export const fetchUser = createAsyncThunk("user/fetch", async() => {
  try {
    const response = await axios.get(`${apiUrl}/user`,{headers:headers()})
    return response.data
  }
  catch (error)
  {
    console.log(error.response.data.error)
    if (error.response.data.error)
    {
      throw new Error(error.response.data.error)
    }

    throw new Error(error.message)
     
  }
})

export const fetchAllUser = createAsyncThunk("user/fetchAll", async() => {
  try {
    const response = await axios.get(`${apiUrl}/users`,{headers:headers()})
    return response.data
  }
  catch (error)
  {
    console.log(error.response.data.error)
    if (error.response.data.error)
    {
      throw new Error(error.response.data.error)
    }

    throw new Error(error.message)
     
  }
})

const initialState = {
  user: JSON.parse(localStorage.getItem('user')),
  token: localStorage.getItem('accessToken'),
  signupState: "idle",
  signupMessage: null,
  signupError: null,
  loginState: "idle",
  loginMessage: null,
  loginError: null,
  userState: "idle",
  userMessage: null,
  userError: null,
  allUsers:[],
  userAllState: "idle",
  userAllMessage: null,
  userAllError: null,
  expireTime:null
};


const userSlice = createSlice({
  name: "userState",
  initialState,
  reducers: {
    resetUserState: () => {
      initialState
    },
    logoutUser: () => {
      initialState
      localStorage.clear()
    }
  },
  extraReducers: (builder) => {

    //user signup

    builder.addCase(signupUser.pending, (state) => {
    state.signupState ="loading"
    })
    builder.addCase(signupUser.fulfilled, (state,action) => {
      state.signupState = "success"
      state.signupMessage = action.payload.message
      state.signupError =null
    })
    builder.addCase(signupUser.rejected, (state, action) => {
      state.signupState = "reject"
      state.signupError = action.error.message
      state.signupMessage = null
    })
    
    //user Login
    
    builder.addCase(loginUser.pending, (state) => {
    state.loginState ="loading"
    })
    builder.addCase(loginUser.fulfilled, (state,action) => {
      state.loginState = "success"
      localStorage.setItem("accessToken", action.payload.token)
      console.log(action.payload)
      state.loginMessage = action.payload.message
      state.loginError = null
    })
    builder.addCase(loginUser.rejected, (state, action) => {
      state.loginState = "reject"
      state.loginError = action.error.message
      state.loginMessage = null
    })

    //get user

     builder.addCase(fetchUser.pending, (state) => {
    state.userState ="loading"
    })
    builder.addCase(fetchUser.fulfilled, (state,action) => {
      state.userState = "success"
      state.user = action.payload.user
      localStorage.setItem("expireTime",JSON.stringify(action.payload))
      localStorage.setItem("user",JSON.stringify(action.payload.user))
      state.userMessage = action.payload.message || null
      state.userError = null
    })
    builder.addCase(fetchUser.rejected, (state, action) => {
      state.userState = "reject"
      state.userError = action.error.message
      state.userMessage = null
    })

    //fetch all users

     builder.addCase(fetchAllUser.pending, (state) => {
    state.userAllState ="loading"
    })
    builder.addCase(fetchAllUser.fulfilled, (state,action) => {
      state.userAllState = "success"
     state.allUsers =action.payload
      state.userAllMessage = action.payload.message || null
      state.userAllError = null
    })
    builder.addCase(fetchAllUser.rejected, (state, action) => {
      state.userAllState = "reject"
      state.userAllError = action.error.message
      state.userAllMessage = null
    })

  }
})

export default userSlice.reducer

export const {resetUserState,logoutUser} = userSlice.actions