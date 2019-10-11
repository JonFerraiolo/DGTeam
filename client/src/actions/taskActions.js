
export const GET_TASKS_SUCCESS = 'GET_TASKS_SUCCESS'

export function getTasksSuccess(account, progress, tasks) {
  return {
    type: GET_TASKS_SUCCESS,
    account,
    progress,
    tasks
  }
}

export const GET_TASK_SUCCESS = 'GET_TASK_SUCCESS'

export function getTaskSuccess(account, progress, tasks) {
  return {
    type: GET_TASK_SUCCESS,
    account,
    progress,
    tasks
  }
}

export const TASK_UPDATE_PROGRESS_SUCCESS = 'TASK_UPDATE_PROGRESS_SUCCESS'

export function taskUpdateProgressSuccess(account, progress, tasks) {
  return {
    type: TASK_UPDATE_PROGRESS_SUCCESS,
    account,
    progress,
    tasks
  }
}

export const TASK_REVERT_PROGRESS_SUCCESS = 'TASK_REVERT_PROGRESS_SUCCESS'

export function taskRevertProgressSuccess(account, progress, tasks) {
  return {
    type: TASK_REVERT_PROGRESS_SUCCESS,
    account,
    progress,
    tasks
  }
}
