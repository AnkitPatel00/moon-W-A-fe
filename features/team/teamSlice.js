import { createSlice,createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const apiUrl = "https://workasana.up.railway.app/api/teams"

const headers = () => {
  const obj = {
    'Content-Type': 'application/json',
    'Authorization': `${localStorage.getItem("accessToken")}`
  }
  return obj
}

//fetch teams

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



//fetch team with ID

export const fetchTeamWithId = createAsyncThunk("teamWithId/fetch", async(teamId) => {
  try {
    const response = await axios.get(`${apiUrl}/${teamId}`, { headers: headers() })
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


//add teams

export const createTeams = createAsyncThunk("team/create", async(teamData) => {
  try {
    const response = await axios.post(`${apiUrl}`,teamData,{ headers: headers() })
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

//add member to team

export const addMembersToTeams = createAsyncThunk("teamMemeber/add", async (updateData) => {
  try {
    const response = await axios.post(`${apiUrl}/member/${updateData.teamId}`,{members:updateData.members},{ headers: headers() })
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
  teams: [],
  teamWithId:null,
  isForm:false,
  isMemberForm:false,
  teamsFetchState: "idle",
  teamsFetchMessage: null,
  teamsFetchError: null,
  teamsCreateState: "idle",
  teamsCreateMessage: null,
  teamsCreateError: null,
  teamsWithIdState: "idle",
  teamsWithIdMessage: null,
  teamsWithIdError: null,
  teamAddMemberState: "idle",
  teamAddMemberMessage: null,
  teamAddMemberError: null,
};


const teamSlice = createSlice({
  name: "teamState",
  initialState,
  reducers: {
    setisForm: (state,action) => {
      state.isForm = action.payload
      state.teamsCreateMessage= null
      state.teamsCreateError= null
    },
    setisMemberForm: (state,action) => {
      state.isMemberForm = action.payload
      state.teamAddMemberMessage= null
      state.teamAddMemberError= null
    },
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
    
    
    //fetch team with id

    builder.addCase(fetchTeamWithId.pending, (state) => {
    state.teamsWithIdState ="loading"
    })
    builder.addCase(fetchTeamWithId.fulfilled, (state,action) => {
      state.teamsWithIdState = "success"
      state.teamWithId = action.payload
      state.teamsWithIdError = null
    })
    builder.addCase(fetchTeamWithId.rejected, (state, action) => {
      state.teamsWithIdState = "reject"
      state.teamsWithIdError = action.error.message
    })

    
    //create teams

    builder.addCase(createTeams.pending, (state) => {
    state.teamsCreateState ="loading"
    })
    builder.addCase(createTeams.fulfilled, (state,action) => {
      state.teamsCreateState = "success"
      state.teams = [...state.teams, action.payload.newTeam]
      state.teamsCreateMessage = action.payload.message
      state.teamsCreateError = null
    })
    builder.addCase(createTeams.rejected, (state, action) => {
      state.teamsCreateState = "reject"
      state.teamsCreateError = action.error.message
    })
    
    //add member
    
    builder.addCase(addMembersToTeams.pending, (state) => {
    state.teamAddMemberState ="loading"
    })
    builder.addCase(addMembersToTeams.fulfilled, (state,action) => {
      state.teamAddMemberState = "success"
      state.teamAddMemberMessage = action.payload.message
      state.teamAddMemberError = null
    })
    builder.addCase(addMembersToTeams.rejected, (state, action) => {
      state.teamAddMemberState = "reject"
      state.teamAddMemberError = action.error.message
    })

  }
})

export default teamSlice.reducer
export const {setisForm,setisMemberForm} = teamSlice.actions
