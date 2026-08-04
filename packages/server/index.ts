import express from 'express';
import type { Request, Response } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req: Request, res: Response) => {
  res.send('HELLO BUN!');
});

app.get('/api/hello', (req: Request, res: Response) => {
  res.json({ message: 'Hello, World! from Json Object' });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
