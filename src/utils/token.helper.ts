import jwt from "jsonwebtoken";
import { JwtPayload } from "../types/auth.type";

const generateToken = (
  payload: JwtPayload,
  secretKey: string,
  validity: string
) => {
  return jwt.sign(payload, secretKey, { expiresIn: validity });
};

const verifyToken = (token: string, secretKey: string) => {
  return jwt.verify(token, secretKey);
};

const getToken = (payload: JwtPayload) => {
  const accessTokenSecretKey = process.env.ACCESS_TOKEN_KEY || "";
  const refreshTokenSecretKey = process.env.REFRESH_TOKEN_KEY || "";
  const accessToken = generateToken(payload, accessTokenSecretKey, "1h");
  const refreshToken = generateToken(payload, refreshTokenSecretKey, "30d");
  return {
    accessToken,
    refreshToken,
  };
};

export { generateToken, verifyToken, getToken };
