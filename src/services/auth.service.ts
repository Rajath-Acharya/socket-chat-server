import { hash, compare } from "bcrypt";
import { RegisterUserError } from "../types/auth.type";
import { UserModel } from "../models/user.model";
import {v4 as uuidV4} from 'uuid';
import { getToken } from "../utils/token.helper";
import { Response } from 'express';

interface RegisterPayload {
  email: string,
  password: string,
}

const findUserByEmail = async (email:string) => {
  const user = await UserModel.findOne({ email });
  return user;
}

const createUser = async (payload:RegisterPayload) => {
  try {
    const {email, password} = payload;

    const user = await findUserByEmail(email);
    if(user) {
      throw Error(RegisterUserError.USER_EXISTS);
    }
    const hashedPassword = await hash(password,10);
    await UserModel.create({
      userId: uuidV4(),
      email, 
      password: hashedPassword,
      refreshToken: [],
    })
  } catch(error:any) {
    throw Error(error.message);
  }
}

const verifyUser = async(payload:RegisterPayload) => {
  try {
    const {email, password} = payload;
    const user = await findUserByEmail(email);
    if(!user) {
      throw Error(RegisterUserError.USER_DOESNOT_EXIST);
    }
    const passwordInDB = user.password;
   const isValidUser = await compare(password, passwordInDB);
   if(!isValidUser) {
    throw Error(RegisterUserError.INVALID_PASSWORD);
   }
   const {accessToken, refreshToken} = getToken({email});
    await UserModel.findOneAndUpdate({
      email
    },{ 
      $push: {refreshToken},
    }, {
      upsert: true,
      new: true,
    });
    return accessToken;
  } catch(error:any) {
    throw Error(error.message);
  }
}

export {
  createUser,
  verifyUser
}