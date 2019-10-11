
export const PROGRESS_INCREMENT_SUCCESS = 'PROGRESS_INCREMENT_SUCCESS'

export function progressIncrementSuccess(progress) {
  return {
    type: PROGRESS_INCREMENT_SUCCESS,
    progress
  }
}

export const RESET_PROGRESS_SUCCESS = 'RESET_PROGRESS_SUCCESS'

export function resetProgressSuccess(account, progress, tasks) {
  return {
    type: RESET_PROGRESS_SUCCESS,
    account,
    progress,
    tasks
  }
}
