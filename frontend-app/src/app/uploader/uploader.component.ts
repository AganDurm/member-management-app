import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {Router} from '@angular/router';
import {firstValueFrom, Subscription} from 'rxjs';
import {LoadingService} from '../loading.service';
import {ApiService} from '../api/service/api.service';
import {ResponseMessageService} from '../response-message.service';
import {SharedModule} from '../shared/shared.module';
import {PreloaderComponent} from '../preloader/preloader.component';

@Component({
  selector: 'app-uploader',
  templateUrl: './uploader.component.html',
  styleUrl: './uploader.component.less'
})
export class UploaderComponent implements OnInit, OnDestroy {
  private messageSubscription: Subscription = new Subscription();
  private loadingSubscription: Subscription = new Subscription();
  private subscriptionMembers: Subscription = new Subscription();

  protected isLoading: boolean = false;
  protected selectedFile: File | null = null;
  protected messages: string[] = [];

  @Output() uploadComplete = new EventEmitter<void>();

  constructor(private router: Router,
              private apiService: ApiService,
              private loadingService: LoadingService,
              private messageService: ResponseMessageService) {
  }

  ngOnInit() {
    this.loadingSubscription = this.loadingService.loading$.subscribe({ next: isLoading => this.isLoading = isLoading });

    this.subscriptionMembers = this.apiService.countMembers().subscribe({
      next: memberCount => {
        if (memberCount > 0) {
          this.router.navigate(['/members']).then(() => {});
        }
      }
    });

    this.messageSubscription = this.messageService.getMessages().subscribe({ next: messages => this.messages = messages });
  }

  public async uploadExcelFile(): Promise<void> {
    this.loadingService.show();

    const formData: any = new FormData(document.getElementById('uploadForm') as HTMLFormElement);
    formData.append('file', this.selectedFile);

    try {
      await firstValueFrom(this.apiService.uploadExcelFile(formData));
      this.router.navigate(['/members']).then(() => {});
      this.messageService.displayMessage("Upload war erfolgreich.");
    } catch (error) {
      this.messageService.displayMessage("Upload nicht geklappt.");
    } finally {
      this.selectedFile = null;
      this.loadingService.hide();
    }
  }

  public onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  ngOnDestroy() {
    if (this.messageSubscription) {
      this.messageSubscription.unsubscribe();
    }
    if(this.subscriptionMembers) {
      this.subscriptionMembers.unsubscribe();
    }
    if(this.loadingSubscription) {
      this.loadingSubscription.unsubscribe();
    }
  }
}
