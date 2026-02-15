import { Component, Input } from '@angular/core';
import { MessageList } from './components/message-list/message-list';
import { MessageInput } from './components/message-input/message-input';
import { ChatStore } from './services/chat.store';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [MessageList, MessageInput],
  templateUrl: './chat.html',
  styleUrls: ['./chat.css']
})
export class Chat {
  @Input() isVisible = false;

  constructor(
    private router: Router,
    public store: ChatStore
  ){}
  
  handleSend(text: string) {
    this.store.sendMessage('User', text);
  }

  closeChat() {
    // clear the 'popup' outlet from Url 
    this.router.navigate(
      [{ outlets: { popup: null }}]
    );
  }  
}


/*
import { Component, Input } from '@angular/core';
import { MessageList } from './components/message-list/message-list';
import { MessageInput } from './components/message-input/message-input';
import { ChatStore } from './services/chat.store';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [ MessageList, MessageInput],
  templateUrl: './chat.html',
  styleUrl: './chat.css',
})
export class Chat {
  @Input() isVisible = false; //the parent page controls this
  
  constructor(public store: ChatStore) {}

  handleSend(text: string) {
    this.store.sendMessage('User', text);
  }
}
//trying
/*
import { Component } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MessageListComponent } from '../message-list/message-list.component';
import { MessageInputComponent } from '../message-input/message-input.component';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    MatDialogModule, 
    MessageListComponent, // Your existing list component
    MessageInputComponent  // Your existing input component
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent {}*/
