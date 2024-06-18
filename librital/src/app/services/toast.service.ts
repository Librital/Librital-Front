import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  private messages: any[] = [];
  private hasBeenDisplayed: boolean = false;

  constructor(private messageService: MessageService) {}

  add(message: any) {
    this.messages.push(message);
    if (!this.hasBeenDisplayed) {
      this.messageService.add(message);
      this.hasBeenDisplayed = true;
    }
  }

  getMessages() {
    return this.messages;
  }

  clear() {
    this.messages = [];
    this.hasBeenDisplayed = false;
  }

  displayMessages() {
    this.messages.forEach(message => {
      this.messageService.add(message);
    });
    this.clear();
  }



}
