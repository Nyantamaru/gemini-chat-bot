import { randomUUID } from 'crypto';

export type Turn = {
   role: 'user' | 'model';
   parts: [{ text: string }];
};

export class ConversationRepository {
   private readonly conversations = new Map<string, Turn[]>();

   /** Get history for a conversation (empty array if new / unknown). */
   getHistory(conversationId: string): Turn[] {
      // return a copy so callers don't mutate the Map entry by accident
      const history = this.conversations.get(conversationId) ?? [];
      return [...history];
   }

   /** Replace full history for a conversation. */
   saveHistory(conversationId: string, history: Turn[]): void {
      this.conversations.set(conversationId, [...history]);
   }

   /** Create a new conversation id (history starts empty). */
   create(): string {
      const id = randomUUID();
      this.conversations.set(id, []);
      return id;
   }

   /** Clear one conversation. */
   reset(conversationId: string): void {
      this.conversations.set(conversationId, []);
   }

   /** Optional: delete entirely. */
   delete(conversationId: string): boolean {
      return this.conversations.delete(conversationId);
   }

   has(conversationId: string): boolean {
      return this.conversations.has(conversationId);
   }
}

// singleton for the app
export const conversationRepository = new ConversationRepository();
