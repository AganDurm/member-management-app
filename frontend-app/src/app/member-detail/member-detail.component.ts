import {Component, OnDestroy, OnInit} from '@angular/core';
import {Member} from '../model/member';
import {File} from '../model/file';
import {catchError, forkJoin, map, Observable, of, Subscription} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {ApiService} from '../api/service/api.service';
import {LoadingService} from '../loading.service';
import {ResponseMessageService} from '../response-message.service';
import {saveAs} from 'file-saver';
import {ChangedMembersData} from '../model/changed-members-data';
import {ApiResponse} from '../api/models/api-response';
import {EditStates} from './models/editStates';
import {SharedModule} from '../shared/shared.module';
import {FilterUserFile} from '../filter-user-file.pipe';
import {PreloaderComponent} from '../preloader/preloader.component';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {GameFiles} from './models/gameFiles';


@Component({
  selector: 'app-member-detail',
  standalone: true,
  imports: [SharedModule, FilterUserFile, PreloaderComponent],
  providers: [LoadingService],
  templateUrl: './member-detail.component.html',
  styleUrl: './member-detail.component.less'
})
export class MemberDetailComponent implements OnInit, OnDestroy {

  pdfUrl: SafeResourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl("");
  selectedFiles: any[] = [];
  messages: string[] = [];
  memberId: string | null = '';
  uniqueGameNames: string[] = [];
  games$: Observable<GameFiles[]> = of([]);
  member: Member = {
    id: '',
    username: '',
    password: '',
    active: false,
    mitgliedsnummer: '',
    kundennummer: '',
  };
  editStates: EditStates = {
    username: false,
    mitgliedsnummer: false,
    kundennummer: false,
    password: false,
  };
  game: string = '';
  files: File[] = [];

  private memberSubscription: Subscription = new Subscription();

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
      this.memberSubscription = this.apiService.findById(this.memberId).subscribe({
        next: (data: Member) => {
          this.member = data;
          this.apiService.findAllPdfFilesByMemberId(this.memberId).subscribe({
            next: (files: File[]) => {
              this.files = files;
              this.uniqueGameNames = this.resolveUniqueGames(this.files);
              this.loadAllGamesFiles(this.uniqueGameNames, this.member.id);
            },
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
    this.apiService.deletePdfFileByMemberIdAndFileName(userId, fileName).subscribe({
      next: (respones) => {
        this.files = this.files.filter(item => item.fileName !== fileName);
        this.uniqueGameNames = this.resolveUniqueGames(this.files);
        this.messageService.displayMessage(respones.message);
        this.loadAllGamesFiles(this.uniqueGameNames, this.member.id);
      },
      error: (error) => this.messageService.displayMessage(error.message)
    });
  }

  uploadFile(): void {
    this.loadingService.show();
    let formData: any = new FormData();

    if(this.game !== '' && this.selectedFiles.length > 0) {
      formData.append('game', this.game);

      for (const file of this.selectedFiles) {
        formData.append('files', file);
      }

      this.apiService.uploadPdfFiles(formData, this.memberId).subscribe({
        next: (files) => {
          this.files = files;
          this.uniqueGameNames = this.resolveUniqueGames(this.files);
          this.loadAllGamesFiles(this.uniqueGameNames, this.member.id);
        },
        error: () => this.messageService.displayMessage('Error!')
      });
    } else if(this.game === '') {
      this.messageService.displayMessage('Fehler! Bitte das Spiel auswählen!');
    } else {
      this.messageService.displayMessage('Fehler! Bitte mindestens eine Datei auswählen!');
    }
    this.game = '';
    this.selectedFiles = [];
    (document.getElementById('fileInput') as HTMLInputElement).value = '';

    this.loadingService.hide();
  }

  loadAllGamesFiles(games: string[], memberId: string): void {
    this.loadingService.show();

    const gameFilesObservables = games.map(game =>
        this.apiService.findAllFilesByMemeberIdAndGame(memberId, game).pipe(
            map(files => ({ game, files } as GameFiles)),
            catchError(() => {
              this.messageService.displayMessage(`Error loading files for game ${game}!`);
              return of({ game, files: [] as File[] });
            })
        )
    );

    this.games$ = forkJoin(gameFilesObservables);

    this.loadingService.hide();
  }

  public onFilesSelected(event: any): void {
    this.selectedFiles = event.target.files;
  }

  resolveUniqueGames(userFiles: File[]): string[] {
    if(userFiles.length > 0) {
      const games = userFiles.map(userFile => userFile.game);
      const uniqueGames = new Set(games);
      return Array.from(uniqueGames);
    } else {
      return [];
    }
  };

  ngOnDestroy() {
    if (this.memberSubscription) {
      this.memberSubscription.unsubscribe();
    }
  }
}
