
import { combineReducers } from 'redux'
import accountReducer from './accountReducer'
import progressReducer from './progressReducer'
import tasksReducer from './tasksReducer'

const TeamAppReducer = combineReducers({
  account: accountReducer,
  progress: progressReducer,
  tasks: tasksReducer
})

export default TeamAppReducer
