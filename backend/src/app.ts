if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

import express, { Application, Request, Response } from 'express';

const app: Application = express();
const port: number = Number(process.env.PORT) || 3000;

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World with TypeScript!');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});