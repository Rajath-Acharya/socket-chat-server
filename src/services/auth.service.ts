import { hash, compare } from "bcrypt";
import { AuthErrorMessage, JwtPayload } from "../types/auth.type";
import { UserModel } from "../models/user.model";
import { v4 as uuidV4 } from "uuid";
import { decodeToken, getToken, verifyToken } from "../utils/token.helper";
import { RefreshTokenModel } from "../models/refreshToken.model";

interface RegisterPayload {
  email: string;
  password: string;
}

const findUserByEmail = async (email: string) => {
  const user = await UserModel.findOne({ email }).select('+password');
  return user;
};

const createUser = async (payload: RegisterPayload) => {
  try {
    const { email, password } = payload;
    const user = await findUserByEmail(email);
    if (user) {
      throw new Error(AuthErrorMessage.USER_EXISTS);
    }
    const hashedPassword = await hash(password, 10);
    const userId = uuidV4();
    await UserModel.create({
      userId,
      email,
      password: hashedPassword,
    });
    return await UserModel.findOne({userId});
  } catch (error: any) {
    throw new Error(error.message);
  }
};

const verifyUser = async (payload: RegisterPayload) => {
  try {
    const { email, password } = payload;
    const user = await findUserByEmail(email);
    if (!user) {
      throw new Error(AuthErrorMessage.USER_DOESNOT_EXIST);
    }
    const passwordInDB = user.password;
    const isValidUser = await compare(password, passwordInDB);
    if (!isValidUser) {
      throw new Error(AuthErrorMessage.INVALID_PASSWORD);
    }
    const userId = user.userId;
    const { accessToken, refreshToken } = getToken({ userId});
    const refreshTokenInDB = await RefreshTokenModel.findOne({ userId });
    if(refreshTokenInDB) {
      await RefreshTokenModel.updateOne({
        userId,
        token: refreshToken,
      });
    } else {
      await RefreshTokenModel.create({
        userId,
        token: refreshToken,
      });
    }
    return accessToken;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

const refreshTokenHandler = async (token:string) => {
  try {
    const decoded = decodeToken(token) as JwtPayload;
    const userId = decoded.userId;
    const refreshTokenSecretKey = process.env.REFRESH_TOKEN_KEY ?? '';
    const refreshTokenInDB = await RefreshTokenModel.findOne({userId});
    const refreshToken = refreshTokenInDB?.token ?? '';
    const isValidRefreshToken = verifyToken(refreshToken, refreshTokenSecretKey);
    if(isValidRefreshToken) {
      const { refreshToken:newAccessToken } = getToken({ userId});
      return newAccessToken;
    }
  } catch(error:any) {
    throw new Error(error);
  }
}

export { createUser, verifyUser, refreshTokenHandler };
