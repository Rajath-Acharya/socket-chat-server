import { Router, Request,Response } from "express";
import { RegisterUserError } from "../types/auth.type";
import { createUser, verifyUser } from "../services/auth.service";

const authRouter = Router();

authRouter.post('/register', async (req:Request, res:Response) => {
  const {email, password} = req.body;
  try {
    if(!email) {
      throw Error(RegisterUserError.EMAIL_ERROR);
    }
    if(!password) {
      throw Error(RegisterUserError.PASSWORD_EMPTY);
    }
    const response = await createUser({
      email,
      password
    });
    res
    .status(201)
    .json({ data: response});
  } catch(error:any) {
    res.status(400).send({ error: error.message });
  }
});

authRouter.post('/login', async(req:Request, res:Response) => {
  const {email, password} = req.body;
  try {
    if(!email) {
      throw Error(RegisterUserError.EMAIL_ERROR);
    }
    if(!password) {
      throw Error(RegisterUserError.PASSWORD_EMPTY);
    }
    const accessToken = await verifyUser({
      email,
      password
    });
    res
    .cookie("access_token", accessToken , {
      httpOnly: true,
    })
    .status(200)
    .json({ auth: true});
  } catch(error:any) {
    res.status(400).send({ error: error.message });
  }
})

export default authRouter;