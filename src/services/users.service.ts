import { FriendRequestModel } from "../models/friendRequest.model";
import { FriendModel } from "../models/friend.model";
import { UserModel } from "../models/user.model"
import { Friend } from "../types/friend.type";
import { FriendRequest } from "../types/friendRequest.type";
import { User } from "../types/auth.type";

const getAllUsers = async (userId:string) => {
  const friends:Friend[] = await FriendModel.find({ $or: [{userId}, {friendId: userId}]});
  const friendsMap = new Map();
  const friendRequests:FriendRequest[] = await FriendRequestModel.find({ $or: [ { 
    requesterId: userId}, {reviewerId: userId}]});    
  const friendRequestsMap = new Map();

  friends.forEach((friend:Friend) => {
      friendsMap.set(friend.userId, friend.userId);
      friendsMap.set(friend.friendId, friend.friendId);
  });

  friendRequests.forEach((friendRequest:FriendRequest) => {
      friendRequestsMap.set(friendRequest.requesterId, true);
      friendRequestsMap.set(friendRequest.reviewerId, true);
  });

  const users:User[] = await UserModel.find({ userId: { $ne: userId }});

  const filteredUsers = users.filter((user:User) => {
    const isFriend = friendsMap.get(user.userId);
    const isFriendRequestSentOrReceived = friendRequestsMap.get(user.userId);
    if(isFriend) return false;
    if(isFriendRequestSentOrReceived) return false;
    return true;
  });
  
  return filteredUsers;
}

const getLoggedInUserInfo = async (userId:string) => {
  return await UserModel.find({ userId });
}

export {getAllUsers,getLoggedInUserInfo};