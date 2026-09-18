import express from 'express';
import type { Request, Response } from 'express';
import dotenv from 'dotenv';
import { randomUUID } from 'crypto';
import { GoogleGenAI } from '@google/genai';
import z from 'zod';

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

const chatSchema = z.object({
   prompt: z
      .string()
      .trim()
      .min(1, 'Prompt is required')
      .max(1000, 'Prompt is too long(max 1000 characters)'),
   conversationId: z.uuid().optional(),
});
app.post('/api/chat', async (req: Request, res: Response) => {
   const parseResult = chatSchema.safeParse(req.body);

   if (!parseResult.success) {
      // ALWAYS send a response on validation failure
      return res.status(400).json({
         error: 'Invalid request',
         details: z.treeifyError(parseResult.error),
         // human-readable list, if you want it:
         messages: parseResult.error.issues.map((i) => i.message),
      });
   }
   try {
      const { prompt, conversationId } = parseResult.data;

      const id = conversationId ?? randomUUID();
      const history = conversations.get(id) ?? [];

      history.push({ role: 'user', parts: [{ text: prompt }] });

      const response = await ai.models.generateContent({
         model: 'gemini-2.0-flash',
         contents: history,
      });

      const text = response.text ?? '';
      history.push({ role: 'model', parts: [{ text }] });
      conversations.set(id, history);

      return res.json({
         conversationId: id,
         message: text,
      });
   } catch (err) {
      console.error('CHAT ERROR:', err);
      return res.status(500).json({
         error: err instanceof Error ? err.message : 'Failed',
      });
   }
});

app.listen(port, () => {
   console.log(`Server is running on http://localhost:${port}`);
});

/*                "conversationId":"69178b3f-5b9a-42f1-bdd7-cf9d4eae5f1d"
                  7181c15c-d212-4340-b344-56441d656a93
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
