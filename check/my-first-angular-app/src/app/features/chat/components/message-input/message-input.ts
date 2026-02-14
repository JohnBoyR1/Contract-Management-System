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
  @Output() send = new EventEmitter<string>();
  text = '';

  submit() {
    if (!this.text.trim()) return;
    this.send.emit(this.text);
    this.text = '';
  }
}