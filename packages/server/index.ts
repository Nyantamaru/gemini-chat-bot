import express from 'express';
import type { Request, Response } from 'express';
import dotenv from 'dotenv';
import OpenAI from 'openai';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const ai = new GoogleGenAI({});

const app = express();
app.use(express.json());
const port = process.env.PORT || 3000;

app.get('/', (req: Request, res: Response) => {
   res.send('HELLO BUN!');
});

app.get('/api/hello', (req: Request, res: Response) => {
   res.json({ message: 'Hello, World! from Json Object' });
});

app.post('/api/chat', async (req: Request, res: Response) => {
   const { prompt } = req.body;

   const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash-lite',
      contents: prompt,
   });

   console.log(response.text);

   res.json({ message: response.text });
});

app.listen(port, () => {
   console.log(`Server is running on http://localhost:${port}`);
});

/*
// Open AI API Key:
import express from "express";
import type { Request, Response } from "express";
import dotenv from "dotenv";
import OpenAI from "openai";


dotenv.config();

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });


const app = express();
app.use(express.json());
const port = process.env.PORT || 3000;

app.get("/", (req: Request, res: Response) => {
  res.send("HELLO BUN!");
});

app.get("/api/hello", (req: Request, res: Response) => {
  res.json({ message: "Hello, World! from Json Object" });
});

app.post("/api/chat", async (req: Request, res: Response) => {
const {prompt} = req.body;

  const response = await client.responses.create({
    model: "gpt-4o-mini",
    input: prompt,
    temperature: 0.2,
    max_output_tokens: 100,

});

res.json({ message: response.output_text });

})

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});


*/
