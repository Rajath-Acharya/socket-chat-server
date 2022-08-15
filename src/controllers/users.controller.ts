import { Router, Request, Response } from "express";
import { validateRequest } from "../middlewares/auth.middleware";
import { getAllUsers, getLoggedInUserInfo } from "../services/users.service";

const usersRoute = Router();

usersRoute.get('/users', validateRequest, async (req:Request, res:Response) => {
  try {
    const userId = res.locals.userId;
    const users = await getAllUsers(userId);    
    res.status(200).json({users});
  } catch(error) {
    res.status(400).json({error: "Failed fetch users"});
  }
})

usersRoute.get('/me', validateRequest, async (req:Request, res:Response) => {
  try {
    const userId = res.locals.userId;
    const user = await getLoggedInUserInfo(userId);    
    res.status(200).json({profile: user});
  } catch(error) {
    res.status(400).json({error: "Failed to load profile"});
  }
})

export default usersRoute;