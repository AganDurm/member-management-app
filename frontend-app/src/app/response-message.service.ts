import { Injectable } from '@angular/core';
import { Subject, Observable, timer } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ResponseMessageService {
  private messages: string[] = [];
  private messageSubject = new Subject<string[]>();

  constructor() {}

  displayMessage(message: string): void {
    this.messages.push(message);
    this.messageSubject.next(this.messages);

    timer(4000).subscribe(() => {
      this.clearMessage();
    });
  }

  clearMessage(): void {
    if (this.messages.length > 0) {
      this.messages.shift();
      this.messageSubject.next(this.messages);
    }
  }

  getMessages(): Observable<string[]> {
    return this.messageSubject.asObservable();
  }
}
