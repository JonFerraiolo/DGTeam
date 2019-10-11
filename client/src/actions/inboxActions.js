
export const GET_INBOX_SUCCESS = 'GET_INBOX_SUCCESS'

export function getInboxSuccess(account, progress, tasks) {
  return {
    type: GET_INBOX_SUCCESS,
    account,
    progress,
    tasks
  }
}
