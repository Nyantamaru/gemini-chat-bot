import express from 'express';
import dotenv from 'dotenv';
import router from './routes';

dotenv.config();

const app = express();
app.use(express.json());
app.use(router);

const port = process.env.PORT || 3000;

app.listen(port, () => {
   console.log(`Server is running on http://localhost:${port}`);
});

/*     
gemini-3.7-flash or gemini-3.5-flash-lite

           "conversationId":"69178b3f-5b9a-42f1-bdd7-cf9d4eae5f1d"
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
