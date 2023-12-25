import {Component, OnDestroy, OnInit} from '@angular/core';
import {ResponesMessageService} from './respones-message.service';
import {LoadingService} from './preloader/service/loading.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  isLoading: boolean;
  messages = [];
  private messagesSubscription: Subscription;
  private loadingSubscription: Subscription;

  constructor(private messageService: ResponesMessageService,
              private loadingService: LoadingService) {}

  ngOnInit() {
    this.messagesSubscription = this.messageService.getMessages().subscribe(messages => this.messages = messages);
    this.loadingSubscription = this.loadingService.loading$.subscribe(isLoading => this.isLoading = isLoading);
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
