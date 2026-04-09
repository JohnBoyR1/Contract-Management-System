/* NOTE: User-to-user messaging is not functioning with the current backend/RDS/cloud integration. */
import { Component, Input } from '@angular/core';
import { ChatMessage } from '../../services/chat.store';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-message-list',
  standalone: true,
  imports: [NgFor],
  templateUrl: './message-list.html',
  styleUrl: './message-list.css',
})
export class MessageList {
  @Input() messages: ChatMessage[] = [];//message passed in from the parent component
}
