
/**
 * Returns the current value of localProgress (level, tasknum, step) pullef from localStorage
 */
export function getLocalProgress() {
  let email = localStorage.getItem("teamAppEmail")
  if (!email) {
    return null
  }
  let localProgress = JSON.parse(localStorage.getItem("teamAppLocalProgress_"+email))
  if (!localProgress) {
    return null
  }
  return localProgress
}

/**
 * Sets the current value of localProgress (level, tasknum, step) pullef from localStorage
 */
export function setLocalProgress(localProgress) {
  //FIXME temporary
  localStorage.removeItem("teamAppLocalProgress")
  let email = localStorage.getItem("teamAppEmail")
  localStorage.setItem("teamAppLocalProgress_"+email, JSON.stringify(localProgress))
}
