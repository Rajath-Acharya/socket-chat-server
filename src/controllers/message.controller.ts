import { Router, Request, Response } from "express";
// import { io } from "../server"; 
import { MessageModel } from "../models/message.model";
import { validateRequest } from "../middlewares/auth.middleware";

const messageRouter = Router();

messageRouter.post("/messages", validateRequest, async (req: Request, res: Response) => {
  const { userId, messageId, message } = req.body;
  const messages = new MessageModel({
    parentId: null,
    userId,
    message,
    messageId,
  });
  try {
    const response = await messages.save();
    // io.emit("message", req.body);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).send({ error });
  }
});

messageRouter.get("/messages", validateRequest, async (_, res: Response) => {
  const messages = await MessageModel.find();
  return res.status(200).json(messages);
});

export default messageRouter;
