import { hash } from "bcrypt";
import { RegisterUserError } from "../types/auth.type";
import { UserModel } from "../models/user.model";
import {v4 as uuidV4} from 'uuid';

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
    if(!email) {
      throw Error(RegisterUserError.EMAIL_ERROR);
    }
    if(!password) {
      throw Error(RegisterUserError.PASSWORD_EMPTY);
    }
    const user = await findUserByEmail(email);
    if(user) {
      throw Error(RegisterUserError.USER_EXISTS);
    }
    const hashedPassword = await hash(password,10);
    await UserModel.create({
      userId: uuidV4(),
      email, 
      password: hashedPassword,
    })
  } catch(error:any) {
    throw Error(error.message);
  }
}

export {
  createUser
}