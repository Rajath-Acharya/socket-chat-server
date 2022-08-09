import { Schema,model } from "mongoose";

const schema = new Schema({
  userId: {
    type: 'String',
    required: true,
    unique: true,
    index: true
  },
  token: {
    type: "String",
    required: true,
    unique: true
  }
})

export const RefreshTokenModel = model('refreshToken', schema);