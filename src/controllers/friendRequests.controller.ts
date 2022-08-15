import { Router, Request, Response } from "express";
import { FriendRequestModel } from "../models/friendRequest.model";
import { validateRequest } from "../middlewares/auth.middleware";
import { UserModel } from "../models/user.model";
import { FriendRequest } from "../types/friendRequest.type";

const friendRequestsRouter = Router();

friendRequestsRouter.get('/friendRequests', validateRequest, async(_, res:Response) => {
  try {
    const userId = res.locals.userId;
    const friendRequests:FriendRequest[] = await FriendRequestModel.find({reviewerId: userId});
    const promises = friendRequests.map((request:FriendRequest) => (
      UserModel.find({userId: request?.requesterId})
      .select('userName')
      .select('email')
      .select('userId')
    ));
    const response = await Promise.all(promises);
    const formattedResponse = response.flatMap((data)=>data);
    res.status(200).json({friendRequests: formattedResponse});
  } catch(error:any) {
    res.status(400).json({error});
  }
});

friendRequestsRouter.post('/friendRequests/:userId',validateRequest, async(req:Request, res:Response) => {
  try {
    const requesterUserId = res.locals.userId;
    const reviewerUserId = req.params.userId;
    const friendRequestCollection = await FriendRequestModel.find({
      requesterId: requesterUserId,
      reviewerId: reviewerUserId
    });    
    if(friendRequestCollection?.length > 0) {
      return res.status(409).json({message: "Already sent friend request"});
    } 
      await FriendRequestModel.create({
        requesterId: requesterUserId,
        reviewerId: reviewerUserId
      })
    res.status(200).send({ success: true });
  } catch(error:any) {
    console.log('catch');
    res.status(400).json({error});
  }
})

export default friendRequestsRouter;