import jwt from "jsonwebtoken";
import { JwtPayload } from "../types/auth.type";

const ACCESS_TOKEN_DURATION = "1d";
const REFRESH_TOKEN_DURATION = "30d";

const generateToken = (
  payload: JwtPayload,
  secretKey: string,
  validity: string
) => {
  return jwt.sign(payload, secretKey, { expiresIn: validity });
};

const verifyToken = (token: string, secretKey: string) => {
  try {
    return jwt.verify(token, secretKey);
  } catch(e) {
    console.log('XX',e);
    
    throw Error('x');
  }
};

const decodeToken = (token: string) => {
  return jwt.decode(token);
};

const getAccessToken = (payload: JwtPayload) => {
  const accessTokenSecretKey = process.env.ACCESS_TOKEN_KEY || "";
  const accessToken = generateToken(
    payload,
    accessTokenSecretKey,
    ACCESS_TOKEN_DURATION
  );
  return accessToken;
};

const getRefreshToken = (payload: JwtPayload) => {
  const accessTokenSecretKey = process.env.REFRESH_TOKEN_KEY || "";
  const refreshToken = generateToken(
    payload,
    accessTokenSecretKey,
    REFRESH_TOKEN_DURATION
  );
  return refreshToken;
};

export {
  generateToken,
  verifyToken,
  decodeToken,
  getAccessToken,
  getRefreshToken,
};
