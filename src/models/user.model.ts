import {Schema, model} from 'mongoose';

const userSchema = new Schema({
    userId: {
      type: 'String',
      required: true,
      unique: true,
      index: true
    },
    email: {
      type: 'String',
      required: true,
      unique: true,
      index: true,
      validate: {
        validator(value:string) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        },
        message: '{VALUE} is not a valid email!',
      }
    },
    password: {
      type: 'String',
      required: true,
    },
    refreshToken: [{
      type: 'String'
    }]
  },
  {
    timestamps: true,
    versionKey: false
  }
);

export const UserModel = model('User', userSchema);