import { hash, compare } from "bcrypt";
import { AuthErrorMessage, JwtPayload } from "../types/auth.type";
import { UserModel } from "../models/user.model";
import { v4 as uuidV4 } from "uuid";
import {
  decodeToken,
  getAccessToken,
  getRefreshToken,
  verifyToken,
} from "../utils/token.helper";
import { RefreshTokenModel } from "../models/refreshToken.model";

interface RegisterPayload {
  userName?: string,
  email: string;
  password: string;
}

const findUserByEmail = async (email: string) => {
  const user = await UserModel.findOne({ email }).select("+password");
  return user;
};

const createUser = async (payload: RegisterPayload) => {
    const { userName, email, password } = payload;
    const user = await findUserByEmail(email);
    if (user) {
      throw new Error(AuthErrorMessage.USER_EXISTS);
    }
    const hashedPassword = await hash(password, 10);
    const userId = uuidV4();
    await UserModel.create({
      userId,
      userName,
      email,
      password: hashedPassword,
    });
    return await UserModel.findOne({ userId });
};

const verifyUser = async (payload: RegisterPayload) => {
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
    const accessToken = getAccessToken({ userId });
    const refreshToken = getRefreshToken({ userId });
    const refreshTokenInDB = await RefreshTokenModel.findOne({ userId });
    if (refreshTokenInDB) {
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
};

const refreshTokenHandler = async (token: string) => {
    const decoded = decodeToken(token) as JwtPayload;
    const userId = decoded.userId;
    const refreshTokenSecretKey = process.env.REFRESH_TOKEN_KEY ?? "";
    const refreshTokenInDB = await RefreshTokenModel.findOne({ userId });
    const refreshToken = refreshTokenInDB?.token ?? "";
    const isValidRefreshToken = verifyToken(
      refreshToken,
      refreshTokenSecretKey
    );
    if (isValidRefreshToken) {
      const accessToken = getAccessToken({ userId });
      return accessToken;
    }
};

export { createUser, verifyUser, refreshTokenHandler };
