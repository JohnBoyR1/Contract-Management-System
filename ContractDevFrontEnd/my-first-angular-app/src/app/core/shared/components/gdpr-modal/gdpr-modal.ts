import { Component, EventEmitter, Output, AfterViewInit, Input } from '@angular/core';
import { Modal } from 'bootstrap';

@Component({
  selector: 'app-gdpr-modal',
  standalone: true,
  templateUrl: './gdpr-modal.html',
  styleUrl: './gdpr-modal.css',
})
export class GdprModal implements AfterViewInit {
  @Input() showButtons = true;

  @Output() accepted = new EventEmitter<void>();

  private modal!: Modal;

  ngAfterViewInit() {
    const modalEl = document.getElementById('gdprModal');
    this.modal = new Modal(modalEl!);
  }

  open() {
    this.modal.show();
  }

  accept() {
    this.modal.hide();
    this.accepted.emit();  
  }


}