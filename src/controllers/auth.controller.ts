import {Router, Request,Response} from "express";
import { createUser } from "../services/auth.service";

const authRouter = Router();

authRouter.post('/register', async (req:Request, res:Response) => {
  const {email, password} = req.body;
  try {
    await createUser({
      email,
      password
    });
    res.status(201).send({ success: true });
  } catch(error:any) {
    res.status(400).send({ error: error.message })
  }
})

export default authRouter;