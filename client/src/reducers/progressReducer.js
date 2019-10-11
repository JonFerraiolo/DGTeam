
import {
  PROGRESS_INCREMENT_SUCCESS,
  RESET_PROGRESS_SUCCESS
} from '../actions/progressActions'
import {
  GET_INBOX_SUCCESS
} from '../actions/inboxActions'
import {
  GET_TASK_SUCCESS,
  GET_TASKS_SUCCESS,
  TASK_UPDATE_PROGRESS_SUCCESS,
  TASK_REVERT_PROGRESS_SUCCESS
} from '../actions/taskActions'

export default function progressReducer(state = null, action) {
  switch (action.type) {
    case GET_TASKS_SUCCESS:
    case GET_INBOX_SUCCESS:
    case GET_TASK_SUCCESS:
    case TASK_UPDATE_PROGRESS_SUCCESS:
    case TASK_REVERT_PROGRESS_SUCCESS:
    case RESET_PROGRESS_SUCCESS:
      return Object.assign({}, state, action.progress )
    case PROGRESS_INCREMENT_SUCCESS:
      return Object.assign({}, state, action.progress )
    default:
      return state || null
  }
}
