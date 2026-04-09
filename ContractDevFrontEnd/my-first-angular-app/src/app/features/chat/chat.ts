import { Component, Input } from '@angular/core';
import { MessageList } from './components/message-list/message-list';
import { MessageInput } from './components/message-input/message-input';
import { ChatStore } from './services/chat.store';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [MessageList, MessageInput],//child components used in chat
  templateUrl: './chat.html',
  styleUrls: ['./chat.css']
})
export class Chat {
  @Input() isVisible = false;// parent controls whether chat popup is shown

  constructor(
    private router: Router,
    public store: ChatStore
  ){}
  
  //adds a new message from the user
  handleSend(text: string) {
    this.store.sendMessage('User', text);
  }

  closeChat() {
    // clear the 'popup' outlet from Url (close chat window) 
    this.router.navigate(
      [{ outlets: { popup: null }}]
    );
  }  
}
