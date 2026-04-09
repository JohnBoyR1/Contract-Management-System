/* NOTE: User-to-user messaging is not functioning with the current backend/RDS/cloud integration. */
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-message-input',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './message-input.html',
  styleUrl: './message-input.css',
})
export class MessageInput {
  @Output() send = new EventEmitter<string>(); //lets the parent component recieve the typed message
  text = '';//holds current test user typed

  submit() {
    if (!this.text.trim()) return;//input empty return
    this.send.emit(this.text);//sends the message to the parent
    this.text = '';//clear input after sending
  }
}