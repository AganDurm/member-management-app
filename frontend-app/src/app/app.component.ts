import {Component, OnDestroy, OnInit} from '@angular/core';
import {LoadingService} from './loading.service';
import {ResponseMessageService} from './response-message.service';
import {Subscription} from 'rxjs';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.less'
})
export class AppComponent implements OnInit, OnDestroy {
  isLoading: boolean = false;
  messages: string[] = [];

  private messagesSubscription: Subscription = new Subscription();
  private loadingSubscription: Subscription = new Subscription();

  constructor(private messageService: ResponseMessageService,
              private loadingService: LoadingService) {}

  ngOnInit() {
    this.messagesSubscription = this.messageService.getMessages().subscribe({ next: messages => this.messages = messages });
    this.loadingSubscription = this.loadingService.loading$.subscribe({ next: isLoading => this.isLoading = isLoading });
  }

  ngOnDestroy() {
    if (this.messagesSubscription) {
      this.messagesSubscription.unsubscribe();
    }
    if (this.loadingSubscription) {
      this.loadingSubscription.unsubscribe();
    }
  }
}
