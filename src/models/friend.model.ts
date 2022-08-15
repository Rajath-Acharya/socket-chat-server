import {Schema, model} from 'mongoose';

const friendSchema = new Schema({
  userId: {
    type: 'String',
    required: true,
    index: true
  },
  friendId: {
    type: 'String',
    required: true,
    index: true
  },
  status: {
    type: 'String',
    default: 'ACCEPTED'
  }
},
{
  timestamps: true,
  versionKey: false
},
);

export const FriendModel = model('friend', friendSchema);