import {Schema, model} from 'mongoose';

const friendRequestSchema = new Schema({
  requesterId: {
    type: 'String',
    required: true,
    index: true
  },
  reviewerId: {
    type: 'String',
    required: true,
    index: true
  },
  status: {
    type: 'String',
    default: 'PENDING'
  }
},
{
  timestamps: true,
  versionKey: false 
},
);

export const FriendRequestModel = model('friendrequest', friendRequestSchema);