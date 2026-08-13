import express from 'express';
import type { Request, Response } from 'express';
import dotenv from 'dotenv';
import { randomUUID } from 'crypto';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const ai = new GoogleGenAI({});

const app = express();
app.use(express.json());
const port = process.env.PORT || 3000;

type Turn = { role: 'user' | 'model'; parts: [{ text: string }] };

// conversationId -> message history
const conversations = new Map<string, Turn[]>();

app.get('/', (_req: Request, res: Response) => {
   res.send('HELLO BUN!');
});

app.post('/api/chat', async (req: Request, res: Response) => {
   try {
      const { prompt, conversationId } = req.body as {
         prompt?: string;
         conversationId?: string;
      };

      if (typeof prompt !== 'string' || !prompt.trim()) {
         return res.status(400).json({ error: 'prompt is required' });
      }

      // use existing id or create a new conversation
      const id =
         typeof conversationId === 'string' && conversationId
            ? conversationId
            : randomUUID();

      const history = conversations.get(id) ?? [];

      history.push({ role: 'user', parts: [{ text: prompt }] });

      const response = await ai.models.generateContent({
         model: 'gemini-3.7-flash',
         contents: history,
      });

      const text = response.text ?? '';
      history.push({ role: 'model', parts: [{ text }] });

      conversations.set(id, history);

      res.json({
         conversationId: id,
         message: text,
      });
   } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to generate response' });
   }
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
