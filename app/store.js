import { configureStore } from '@reduxjs/toolkit'
import userReducer from '../features/user/userSlice'
import projectReducer from '../features/project/projectSlice'
import teamReducer from '../features/team/teamSlice'
import taskReducer from '../features/task/taskSlice'
import reportReducer from '../features/report/reportSlice'
const store = configureStore({
  reducer: {
      userState:userReducer,
    projectState: projectReducer,
    teamState: teamReducer,
    taskState: taskReducer,
      reportState: reportReducer
  }
})

export default store