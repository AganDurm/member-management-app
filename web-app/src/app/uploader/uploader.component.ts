import {Component, EventEmitter, OnInit, OnDestroy, Output} from '@angular/core';
import {LoadingService} from '../preloader/service/loading.service';
import {ApiService} from '../api/service/api.service';
import {Subscription} from 'rxjs';
import {Router} from '@angular/router';
import {ResponesMessageService} from '../respones-message.service';

@Component({
  selector: 'app-uploader',
  templateUrl: './uploader.component.html',
  styleUrls: ['./uploader.component.css']
})
export class UploaderComponent implements OnInit, OnDestroy {
  private messageSubscription: Subscription;
  private loadingSubscription: Subscription;
  private subscriptionMembers: Subscription;

  protected isLoading: boolean = false;
  protected selectedFile: File | null = null;
  protected messages: string[] = [];

  @Output() uploadComplete = new EventEmitter<void>();

  constructor(private loadingService: LoadingService,
              private messageService: ResponesMessageService,
              private apiService: ApiService,
              private router: Router) { }

  ngOnInit() {
    this.loadingSubscription = this.loadingService.loading$.subscribe((isLoading: boolean) => this.isLoading = isLoading);

    this.subscriptionMembers = this.apiService.countMembers().subscribe((memberCount) => {
      if (memberCount > 0) {
        this.router.navigate(['/members']).then(() => {});
      }
    });

    this.messageSubscription = this.messageService.getMessages().subscribe((messages: string[]) => this.messages = messages);
  }

  public async uploadExcelFile(): Promise<void> {
    this.loadingService.show();

    const formData: FormData = new FormData(document.getElementById('uploadForm') as HTMLFormElement);
    formData.append('file', this.selectedFile);

    try {
      await this.apiService.uploadExcelFile(formData).toPromise();
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
