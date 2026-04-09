/* NOTE: This store only saves messages locally. It does NOT sync with the backend/RDS/cloud.
   User-to-user messaging is not functional because no server connection or real-time service
   is implemented yet. */
import { Injectable, signal, effect } from '@angular/core';

export interface ChatMessage {
  from: string;
  text: string;
  time: number;
}

@Injectable({ providedIn: 'root' })
export class ChatStore {
  messages = signal<ChatMessage[]>([]); //holds all chat messages in a reative signal

  constructor() {
    const saved = localStorage.getItem('chat-messages');// load saved messaged 
    if (saved) {
      this.messages.set(JSON.parse(saved));//restore from local storage
    }
    //runs everytime there is a change
    effect(() => {
      localStorage.setItem('chat-messages', JSON.stringify(this.messages()));//saves message to local storage
    });
  }

  sendMessage(from: string, text: string) {
    const msg: ChatMessage = {
      from,
      text,
      time: Date.now(),//timestamp for display
    };

    this.messages.update(m => [...m, msg]);// add the new message to the list
  }
  //clear history
  clearHistory() {
    this.messages.set([]);
    localStorage.removeItem('chat-messages');
  }

}
