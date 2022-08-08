import {Schema, model} from 'mongoose';

const schema = new Schema({
  messageId: {
    type: 'String',
    required: true,
    unique: true,
    index: true,
  },
  parentId: {
    type: 'String',
    unique: true,
  },
  message: {
    type: 'String',
  },
  userId: {
    type: 'String',
    required: true,
  } 
}, 
{
  timestamps: true,
  versionKey: false 
},
);

export const MessageModel = model('Message', schema);
