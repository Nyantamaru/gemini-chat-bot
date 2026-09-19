import type { Request, Response } from 'express';
import z from 'zod';
import { chatService } from '../services/chat.service';

const chatSchema = z.object({
   prompt: z
      .string()
      .trim()
      .min(1, 'Prompt is required')
      .max(1000, 'Prompt is too long (max 1000 characters)'),
   conversationId: z.uuid().optional(),
});

// Public Interface for the chat controller
export const chatController = {
   async sendMessage(req: Request, res: Response) {
      const parseResult = chatSchema.safeParse(req.body);

      if (!parseResult.success) {
         return res.status(400).json({
            error: 'Invalid request',
            details: z.treeifyError(parseResult.error),
            messages: parseResult.error.issues.map((i) => i.message),
         });
      }

      try {
         const { prompt, conversationId } = parseResult.data;
         const response = await chatService.sendMessage(prompt, conversationId);
         const result = {
            conversationId: response.conversationId,
            message: response.message,
         };

         return res.json(result);
      } catch (err) {
         console.error('CHAT ERROR:', err);
         return res.status(500).json({
            error: err instanceof Error ? err.message : 'Failed',
         });
      }
   },
};
