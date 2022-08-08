export enum RegisterUserError {
  USER_EXISTS = "User already exists",
  EMAIL_ERROR = "Enter valid email",
  PASSWORD_EMPTY = "Password cannot be empty", 
  USER_DOESNOT_EXIST = "User does not exist",
  INVALID_PASSWORD = "Invalid password"
}

export interface JwtPayload {
  email: string,
}