import { Component, signal, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Navbar } from './core/layout/header/navbar/navbar';
import { Footer } from './core/layout/footer/footer/footer';
import { Chat } from './features/chat/chat';

@Component({
  selector: 'app-root',
  // standalone: true is no longer required in v21+ as it's the default
  imports: [RouterOutlet, Navbar, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  // 1. Signals for reactive state
  protected readonly title = signal('my-first-angular-app');

  
}

