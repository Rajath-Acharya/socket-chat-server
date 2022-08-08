export interface IMessage {
 id: string,
 message: string,
 user_name: string 
}

export interface MessageReponse {
  id: string,
  message: string,
  user_name: string,
  _id: string,
  createdAt: string,
  updatedAt: string,
  __v: number
}