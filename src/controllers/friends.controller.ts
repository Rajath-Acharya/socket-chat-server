import { Router, Request, Response } from "express";
import { FriendRequestModel } from "../models/friendRequest.model";
import { validateRequest } from "../middlewares/auth.middleware";
import { FriendModel } from "../models/friend.model";
import { Friend } from "../types/friend.type";

const friendsRouter = Router();

friendsRouter.get('/friends',validateRequest, async(_, res:Response) => {
  try {
    const userId = res.locals.userId;
    const friends:Friend[] = await FriendModel.find({ $or: [{ userId: userId}, { friendId: userId }]});
    friends.forEach((friend:Friend) => {
      if(friend.friendId === userId) {       
        friend.friendId = friend.userId;
        friend.userId = userId;
      }
    });
    res.status(200).json({friends});
  } catch(error:any) {
    res.status(400).json({error})
  }
});

friendsRouter.post('/friends/:userId',validateRequest, async(req:Request, res:Response) => {
  try {
    const userId = res.locals.userId;
    const friendId = req.params.userId;
    const friendRequestCollection = await FriendModel.find({
      userId: userId,
      friendId: friendId
    });
    if(friendRequestCollection?.length > 0) {
      return res.status(409).json({message: "Already in your friends list"});
    }
    await FriendModel.create({
      userId: userId,
      friendId: friendId
    });
    await FriendRequestModel.deleteOne(({ 
          $and : [
              {userId : userId},
              {friendId : friendId}
          ]
    }));
    res.status(200).send({success: true});
  } catch(error:any) {
    res.status(400).json({error})
  }
});

export default friendsRouter;