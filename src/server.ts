import express from "express";
import { createServer } from "http";
// import { Server, Socket } from "socket.io";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import messageRouter from "./controllers/message.controller";
import authRouter from "./controllers/auth.controller";
import usersRoute from "./controllers/users.controller";
import friendsRouter from "./controllers/friends.controller";
import friendRequestsRouter from "./controllers/friendRequests.controller";

dotenv.config();

const app = express();

const PORT = 4040;

app.use(cors());
app.use(express.json());

const server = createServer(app);

// export const io = new Server(server, {
//   cors: {
//     origin: "*",
//     methods: ["GET", "POST"],
//   },
// });

app.use("/api/v1/", messageRouter);
app.use("/api/v1/", authRouter);
app.use("/api/v1/", usersRoute);
app.use("/api/v1/", friendsRouter);
app.use("/api/v1/", friendRequestsRouter);

// io.on("connection", (socket: Socket) => {
//   console.log("socket listening");
//   socket.on("disconnect", () => {
//     console.log("socket disconnected");
//   });
// });

async function connectDatabase() {
  const mongoURI = process.env.MONGO_URI || "";
  await mongoose.connect(mongoURI);
  console.log("db connected");
}

function listen() {
  server.listen(PORT, () => {
    console.log(`Server is listening on ${PORT}`);
  });
}

async function startServer() {
  await connectDatabase();
  listen();
}

startServer();
