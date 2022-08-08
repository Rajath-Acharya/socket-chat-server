import express from 'express';
import {createServer} from 'http';
import {Server, Socket} from 'socket.io';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import messageRouter from './controllers/message.controller';
import authRouter from './controllers/auth.controller';
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();

const PORT = 4040;

app.use(cors());
app.use(express.json());
app.use(cookieParser());

const server = createServer(app);

export const io = new Server(server, { 
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

app.use('/api/v1/', messageRouter);
app.use('/api/v1/', authRouter);

io.on("connection", (socket:Socket) => {
console.log('socket listening');
  socket.on("disconnect", () => {
    console.log("socket disconnected");
  })
})

async function connectDatabase() {
  const mongoURI = process.env.MONGO_URI || '';
  await mongoose.connect(mongoURI);
  console.log('db connected');
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


