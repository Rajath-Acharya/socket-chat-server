export enum AuthErrorMessage {
  USER_EXISTS = "User already exists",
  USERNAME_ERROR = "Username cannot be empty",
  EMAIL_ERROR = "Enter valid email",
  PASSWORD_EMPTY = "Password cannot be empty", 
  USER_DOESNOT_EXIST = "User does not exist",
  INVALID_PASSWORD = "Invalid password",
  TOKEN_NOT_FOUND = "Access token is missing",
  INVALID_TOKEN = "Invalid token"
}

export interface JwtPayload {
  userId: string,
}