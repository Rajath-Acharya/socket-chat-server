import express, {Response}  from 'express';

const server = express();

server.get('/', (_, res:Response) => {
  res.send('Hello World!')
})

server.listen(4000, () => {
  console.log('listening');
})