
export const USER_LOGIN_SUCCESS = 'USER_LOGIN_SUCCESS'

export function accountLoginSuccess(account) {
  return {
    type: USER_LOGIN_SUCCESS,
    account
  }
}

export const USER_LOGOUT_SUCCESS = 'USER_LOGOUT_SUCCESS'

export function accountLogoutSuccess() {
  return {
    type: USER_LOGOUT_SUCCESS
  }
}

export const USER_SIGNUP_SUCCESS = 'USER_SIGNUP_SUCCESS'

export function accountSignupSuccess(account) {
  return {
    type: USER_SIGNUP_SUCCESS,
    account
  }
}

export const USER_VERIFICATION_EMAIL_SENT = 'USER_VERIFICATION_EMAIL_SENT'

export function accountVerificationEmailSent(email) {
  return {
    type: USER_VERIFICATION_EMAIL_SENT,
    email
  }
}

export const RESET_PASSWORD_EMAIL_SENT = 'RESET_PASSWORD_EMAIL_SENT'

export function resetPasswordEmailSent(email) {
  return {
    type: RESET_PASSWORD_EMAIL_SENT,
    email
  }
}
