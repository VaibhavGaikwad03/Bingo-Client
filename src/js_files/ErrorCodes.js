export const LoginErrorCodes = {
    NONE : 0,
    USERNAME_NOT_FOUND : 1001,
    PASSWORD_IS_INCORRECT : 1002
};

export const SignupErrorCodes = {
    NONE : 0,
    USERNAME_ALREADY_EXISTS : 2001,
    EMAIL_ALREADY_EXISTS : 2002,
    PHONE_ALREADY_EXISTS : 2003
}

export const ErrorCodes = {  //generic
    INVALID_USER_ID : -1   
}

export const ChangePasswordErrorCodes = {
    NONE : 0,
    NEW_PASSWORD_MUST_BE_DIFFERENT : 3001,
};