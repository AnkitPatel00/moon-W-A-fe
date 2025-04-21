import { createSlice,createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const apiUrl = "http://localhost:3000/api/teams"

const headers = () => {
  const obj = {
    'Content-Type': 'application/json',
    'Authorization': `${localStorage.getItem("accessToken")}`
  }
  return obj
}

export const fetchTeams = createAsyncThunk("team/fetch", async() => {
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
  teams:[],
  teamsFetchState: "idle",
  teamsFetchMessage: null,
  teamsFetchError: null,
};


const teamSlice = createSlice({
  name: "teamState",
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {

    //fetch teams

    builder.addCase(fetchTeams.pending, (state) => {
    state.teamsFetchState ="loading"
    })
    builder.addCase(fetchTeams.fulfilled, (state,action) => {
      state.teamsFetchState = "success"
      state.teams = action.payload
      state.teamsFetchError = null
    })
    builder.addCase(fetchTeams.rejected, (state, action) => {
      state.teamsFetchState = "reject"
      state.teamsFetchError = action.error.message
    })

  }
})

export default teamSlice.reducer
