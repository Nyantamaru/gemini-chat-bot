import { GoogleGenAI } from '@google/genai';
import {
   conversationRepository,
   type Turn,
} from '../repositories/conversation.repository';

const ai = new GoogleGenAI({
   apiKey: process.env.GEMINI_API_KEY ?? process.env.GOOGLE_API_KEY,
});

export type ChatResponse = {
   conversationId: string;
   message: string;
};

export const chatService = {
   async sendMessage(
      prompt: string,
      conversationId?: string
   ): Promise<ChatResponse> {
      const id = conversationId ?? conversationRepository.create();
      const history = conversationRepository.getHistory(id);

      const nextHistory: Turn[] = [
         ...history,
         { role: 'user', parts: [{ text: prompt }] },
      ];

      const response = await ai.models.generateContent({
         model: 'gemini-3.5-flash-lite',
         contents: nextHistory,
      });

      const text = response.text ?? '';

      nextHistory.push({ role: 'model', parts: [{ text }] });
      conversationRepository.saveHistory(id, nextHistory);

      return {
         conversationId: id,
         message: text,
      };
   },
};

/*
gemini-3.7-flash 
gemini-3.6-flash 
gemini-3.5-flash-lite

*/
