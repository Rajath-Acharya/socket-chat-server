import { Router, Request, Response } from "express";
import { AuthErrorMessage } from "../types/auth.type";
import {
  createUser,
  refreshTokenHandler,
  verifyUser,
} from "../services/auth.service";

const authRouter = Router();

authRouter.post("/register", async (req: Request, res: Response) => {
  const { userName, email, password } = req.body;
  try {
    if (!userName) {
      throw Error(AuthErrorMessage.USERNAME_ERROR);
    }
    if (!email) {
      throw Error(AuthErrorMessage.EMAIL_ERROR);
    }
    if (!password) {
      throw Error(AuthErrorMessage.PASSWORD_EMPTY);
    }
    const response = await createUser({
      userName,
      email,
      password,
    });
    res.status(201).json({ data: response });
  } catch (error: any) {
    res.status(400).send({ message: error.message });
  }
});

authRouter.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    if (!email) {
      throw Error(AuthErrorMessage.EMAIL_ERROR);
    }
    if (!password) {
      throw Error(AuthErrorMessage.PASSWORD_EMPTY);
    }
    const accessToken = await verifyUser({
      email,
      password,
    });
    res
      .cookie("access_token", accessToken, {
        httpOnly: true,
      })
      .status(200)
      .json({ auth: true, accessToken});
  } catch (error: any) {
    res.status(400).send({ message: error.message });
  }
});

authRouter.post("/refresh-token", async (req:Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1] || '';
    const newAccessToken = await refreshTokenHandler(token);
    res
      .cookie("access_token", newAccessToken, {
        httpOnly: true,
      })
      .status(200)
      .send({ success: true });
  } catch (error: any) {
    res.status(403).send({ error });
  }
});

export default authRouter;
