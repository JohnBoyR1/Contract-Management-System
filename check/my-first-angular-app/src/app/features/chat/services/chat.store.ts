import { Injectable, signal, effect } from '@angular/core';

export interface ChatMessage {
  from: string;
  text: string;
  time: number;
}

@Injectable({ providedIn: 'root' })
export class ChatStore {
  messages = signal<ChatMessage[]>([]);

  constructor() {
    const saved = localStorage.getItem('chat-messages');
    if (saved) {
      this.messages.set(JSON.parse(saved));
    }

    effect(() => {
      localStorage.setItem('chat-messages', JSON.stringify(this.messages()));
    });
  }

  sendMessage(from: string, text: string) {
    const msg: ChatMessage = {
      from,
      text,
      time: Date.now(),
    };

    this.messages.update(m => [...m, msg]);
  }
  //clear history
  clearHistory() {
    this.messages.set([]);
    localStorage.removeItem('chat-messages');
  }

}
