import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ApiService} from '../api/service/api.service';
import {Member} from '../model/member';
import {Subscription} from 'rxjs';
import {LoadingService} from '../preloader/service/loading.service';
import {File} from '../model/file';
import {ChangedMemebersData} from '../model/changed-memebers-data';
import {ResponesMessageService} from '../respones-message.service';
import { saveAs } from 'file-saver';
import {ApiResponse} from '../api/models/api-response';
import * as pdfjsLib from 'pdfjs-dist';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit, OnDestroy {
  @ViewChild('pdfCanvas') pdfCanvas: ElementRef;

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
  memberId: string;
  editStates = {
    username: false,
    mitgliedsnummer: false,
    kundennummer: false,
    password: false
  };
  files: File[] = [];
  filterText: string = '';
  uniqueGames: string[] = [];
  private subscription: Subscription;

  constructor(private route: ActivatedRoute,
              private apiService: ApiService,
              private loadingService: LoadingService,
              private messageService: ResponesMessageService) { }

  ngOnInit() {
    this.loadingService.show();

    this.messageService.getMessages().subscribe(messages => this.messages = messages);

    this.memberId = this.route.snapshot.paramMap.get('id');
    if (this.memberId) {
      this.subscription = this.apiService.findById(this.memberId).subscribe(
          (data: Member) => {
            this.member = data;
            this.apiService.findAllPdfFilesByMemberId(this.memberId).subscribe(
                (files: File[]) => {
                  this.files = files;
                }, () => {
                  this.messageService.displayMessage('Dateien konnten nicht geladen werden.');
                }
            );
          },
          () => {
            this.messageService.displayMessage('Mitglieder konnten nicht geladen werden.');
          }
      );
    }

    this.loadingService.hide();
  }

  toggleEdit(field: string, newValue: string, userId: string): void {
    this.editStates[field] = !this.editStates[field];

    if (!this.editStates[field]) {
      let changedMembersData: ChangedMemebersData = new ChangedMemebersData(newValue, userId);

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

  saveUsername(changedMembersData: ChangedMemebersData): void {
    this.loadingService.show();

    this.apiService.updateMemberUsername(changedMembersData).subscribe(
        (response: ApiResponse) => {
          console.log(response.message);
        },
        (error) => {
          this.messageService.displayMessage(error.message);
        }
    );

    this.loadingService.hide();
  }

  savePassword(changedMembersData: ChangedMemebersData): void {
    this.loadingService.show();
    this.apiService.updateMemberPassword(changedMembersData).subscribe(
        (response: ApiResponse) => {
          this.messageService.displayMessage(response.message);
        },
        (error) => {
          this.messageService.displayMessage(error.message);
        }
    );
    this.loadingService.hide();
  }

  saveKundennummer(changedMembersData: ChangedMemebersData): void {
    this.loadingService.show();
    this.apiService.updateMemberKundennummer(changedMembersData).subscribe(
        (response: ApiResponse) => {
          this.messageService.displayMessage(response.message);
        },
        (error) => {
          this.messageService.displayMessage(error.message);
        }
    );
    this.loadingService.hide();
  }

  saveMitgliedsnummer(changedMembersData: ChangedMemebersData): void {
    this.loadingService.show();
    this.apiService.updateMemberMitgliedsnummer(changedMembersData).subscribe(
        (response: ApiResponse) => {
          this.messageService.displayMessage(response.message);
        },
        (error) => {
          this.messageService.displayMessage(error.message);
        }
    );
    this.loadingService.hide();
  }

  setUniqueGame(game: string): void {
    this.messageService.displayMessage("Set unique game" + game);
  }

  loadPdf(memberId: string, fileName: string): void {
    pdfjsLib.getDocument("http://localhost:8080/members/" + memberId + "/" + fileName + "/preview").promise.then(pdfDoc => {
      pdfDoc.getPage(1).then(page => {
        const viewport = page.getViewport({ scale: 1 });
        const canvas = this.pdfCanvas.nativeElement as HTMLCanvasElement;
        const context = canvas.getContext('2d');

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
          canvasContext: context,
          viewport: viewport
        };

        page.render(renderContext);
        this.messageService.displayMessage("PDF: "+ fileName + " für " + memberId + " geladen.");
      });
    }).catch(() => {
      this.messageService.displayMessage('Fehler! PDF nicht geladen!');
    });
  }

  downloadFile(userId: string, fileName: string): void {
    this.loadingService.show();

    this.apiService.downloadFileByUserId(userId, fileName).subscribe(blob => {
      saveAs(blob, fileName);
      this.messageService.displayMessage("Datei " + fileName + " für " + userId + " erfolgereich heruntergeladen.");
    }, () => {
      this.messageService.displayMessage('Download Fehler!');
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

    this.apiService.uploadPdfFiles(formData, this.memberId).subscribe(
        (data) => {
          this.files = data;
        }, () => {
          this.messageService.displayMessage('Error!');
        }
    );

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
