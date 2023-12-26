import {Component, OnDestroy, OnInit} from '@angular/core';
import {Member} from '../model/member';
import {File} from '../model/file';
import {Subscription} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {ApiService} from '../api/service/api.service';
import {LoadingService} from '../loading.service';
import {ResponseMessageService} from '../response-message.service';
import {saveAs} from 'file-saver';
// import * as pdfjsLib from 'pdfjs-dist';
import {ChangedMembersData} from '../model/changed-members-data';
import {ApiResponse} from '../api/models/api-response';
import {EditStates} from './models/editStates';
import {SharedModule} from '../shared/shared.module';
import {FilterUserFile} from '../filter-user-file.pipe';
import {PreloaderComponent} from '../preloader/preloader.component';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';


@Component({
  selector: 'app-member-detail',
  standalone: true,
  imports: [SharedModule, FilterUserFile, PreloaderComponent],
  templateUrl: './member-detail.component.html',
  styleUrl: './member-detail.component.less'
})
export class MemberDetailComponent implements OnInit, OnDestroy {

  pdfUrl: SafeResourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl("");
  selectedFiles: any[] = [];
  game: string = '';
  messages: string[] = [];
  member: Member = {
    id: '',
    username: '',
    password: '',
    active: false,
    mitgliedsnummer: '',
    kundennummer: '',
  };
  memberId: string | null = '';
  editStates: EditStates = {
    username: false,
    mitgliedsnummer: false,
    kundennummer: false,
    password: false,
  };
  files: File[] = [];
  filterText: string = '';
  uniqueGames: string[] = [];

  private subscription: Subscription = new Subscription();

  constructor(private route: ActivatedRoute,
              private apiService: ApiService,
              private loadingService: LoadingService,
              private messageService: ResponseMessageService,
              private sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.loadingService.show();

    this.messageService.getMessages().subscribe(messages => this.messages = messages);

    this.memberId = this.route.snapshot.paramMap.get('id');
    if (this.memberId) {
      this.subscription = this.apiService.findById(this.memberId).subscribe({
        next: (data: Member) => {
          this.member = data;
          this.apiService.findAllPdfFilesByMemberId(this.memberId).subscribe({
            next: (files: File[]) => this.files = files,
            error: () => this.messageService.displayMessage('Dateien konnten nicht geladen werden.')
          });
        },
        error: () => this.messageService.displayMessage('Mitglieder konnten nicht geladen werden.')
      });
    }

    this.loadingService.hide();
  }

  toggleEdit(field: keyof EditStates, newValue: string, userId: string): void {
    this.editStates[field] = !this.editStates[field];

    if (!this.editStates[field]) {
      let changedMembersData: ChangedMembersData = new ChangedMembersData(newValue, userId);

      switch (field) {
        case 'username':
          this.saveUsername(changedMembersData);
          break;
        case 'password':
          this.savePassword(changedMembersData);
          break;
        case 'kundennummer':
          this.saveKundennummer(changedMembersData);
          break;
        case 'mitgliedsnummer':
          this.saveMitgliedsnummer(changedMembersData);
          break;
        default:
          console.warn(`Save method not implemented for field: ${field}`);
      }
    }
  }

  saveUsername(changedMembersData: ChangedMembersData): void {
    this.loadingService.show();

    this.apiService.updateMemberUsername(changedMembersData).subscribe({
      next: (response: ApiResponse) => this.messageService.displayMessage(response.message),
      error: (error) => this.messageService.displayMessage(error.message)
    });

    this.loadingService.hide();
  }

  savePassword(changedMembersData: ChangedMembersData): void {
    this.loadingService.show();

    this.apiService.updateMemberPassword(changedMembersData).subscribe({
      next: (response: ApiResponse) => this.messageService.displayMessage(response.message),
      error: (error) => this.messageService.displayMessage(error.message)
    });

    this.loadingService.hide();
  }

  saveKundennummer(changedMembersData: ChangedMembersData): void {
    this.loadingService.show();

    this.apiService.updateMemberKundennummer(changedMembersData).subscribe({
      next: (response: ApiResponse) => this.messageService.displayMessage(response.message),
      error: (error) => this.messageService.displayMessage(error.message)
    });

    this.loadingService.hide();
  }

  saveMitgliedsnummer(changedMembersData: ChangedMembersData): void {
    this.loadingService.show();

    this.apiService.updateMemberMitgliedsnummer(changedMembersData).subscribe({
      next: (response: ApiResponse) => this.messageService.displayMessage(response.message),
      error: (error) => this.messageService.displayMessage(error.message)
    });

    this.loadingService.hide();
  }

  setUniqueGame(game: string): void {
    this.messageService.displayMessage("Set unique game" + game);
  }

  loadPdf(memberId: string, fileName: string): void {
    const unsafeUrl = "http://localhost:8080/members/" + memberId + "/" + fileName + "/preview";
    this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(unsafeUrl);
  }

  downloadFile(userId: string, fileName: string): void {
    this.loadingService.show();

    this.apiService.downloadFileByUserId(userId, fileName).subscribe({
      next:(blob) => {
        saveAs(blob, fileName);
        this.messageService.displayMessage("Datei " + fileName + " für " + userId + " erfolgereich heruntergeladen.");
        },
      error: () => this.messageService.displayMessage('Download Fehler!')
    });

    this.loadingService.hide();
  }

  deleteFile(userId: string, fileName: string): void {
    this.messageService.displayMessage("Delete file" + userId + " : " + fileName);
  }

  uploadFile(): void {
    this.loadingService.show();

    const formData: any = new FormData();
    formData.append('game', this.game);

    for (let i = 0; i < this.selectedFiles.length; i++) {
      formData.append('files', this.selectedFiles[i]);
    }

    this.apiService.uploadPdfFiles(formData, this.memberId).subscribe({
      next: (data) => this.files = data,
      error: () => this.messageService.displayMessage('Error!')
    });

    this.loadingService.hide();
  }

  public onFilesSelected(event: any) {
    this.selectedFiles = event.target.files;
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
