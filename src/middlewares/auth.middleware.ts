import { Request,Response,NextFunction } from "express";
import { AuthErrorMessage, JwtPayload } from "../types/auth.type";
import { decodeToken, verifyToken } from "../utils/token.helper";

const validateRequest = (req:Request, res:Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1] || '';
    if(!token) {
      return res.status(400).json({error: AuthErrorMessage.TOKEN_NOT_FOUND});
    }
    const decoded = decodeToken(token) as JwtPayload;
    const userId = decoded?.userId;
    if(!userId) {
      return res.status(400).json({error: AuthErrorMessage.INVALID_TOKEN});
    }
    const accessTokenSecretKey = process.env.ACCESS_TOKEN_KEY ?? '';
    verifyToken(token, accessTokenSecretKey);
    res.locals.token = token;
    next();
  } catch(error:any) {
    return res.status(401).json({error});
  }
}

export {validateRequest};