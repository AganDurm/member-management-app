import {Component, OnDestroy, OnInit} from '@angular/core';
import {Member} from '../model/member';
import {File} from '../model/file';
import {catchError, EMPTY, finalize, forkJoin, map, Observable, of, Subscription, switchMap} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {ApiService} from '../api/service/api.service';
import {LoadingService} from '../loading.service';
import {ResponseMessageService} from '../response-message.service';
import {saveAs} from 'file-saver';
import {ChangedMembersData} from '../model/changed-members-data';
import {ApiResponse} from '../api/models/api-response';
import {EditStates} from './models/editStates';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {GameFiles} from './models/gameFiles';
import {Orders} from '../model/orders';


@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrl: './member-detail.component.less'
})
export class MemberDetailComponent implements OnInit, OnDestroy {

  pdfUrl: SafeResourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl("");
  selectedFiles: any[] = [];
  orders: Orders[] = [];
  selectedGame: string = '';
  messages: string[] = [];
  memberId: number | null = 0;
  uniqueGameNames: string[] = [];
  games$: Observable<GameFiles[]> = of([]);
  member: Member = {
    id: 0,
    email: '',
    username: '',
    password: '',
    active: false,
    mitgliedsnummer: '',
    kundennummer: '',
    cardnumber: '',
    visaormc: '',
    month: '',
    year: '',
    cvc: '',
    nameoncard: '',
    geb: '',
    street: '',
    plz: '',
    city: '',
  };
  editStates: EditStates = {
    username: false,
    mitgliedsnummer: false,
    kundennummer: false,
    password: false,
    cardnumber: false,
    visaormc: false,
    month: false,
    year: false,
    cvc: false,
    nameoncard: false,
    geb: false,
    street: false,
    plz: false,
    city: false,
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

    this.apiService.findAllOrders().subscribe({
      next: (data: Orders[]) => {
        this.orders = data;
      },
      error: () => this.messageService.displayMessage('Bestellungen konnten nicht geladen werden.')
    });

    this.memberId = parseFloat(this.route.snapshot.paramMap.get('id') as string);

    if (this.memberId) {
      this.apiService.findById(this.memberId).pipe(
          switchMap((member: Member) => {
            this.member = member;
            return this.apiService.findAllPdfFilesByMemberId(this.memberId);
          }),
          catchError(() => {
            this.messageService.displayMessage('Mitglied konnten nicht geladen werden.');
            return EMPTY;
          })
      ).subscribe({
        next: (files: File[]) => {
          this.files = files;
          this.uniqueGameNames = this.resolveUniqueGames(this.files);
          this.loadAllGamesFiles(this.uniqueGameNames, this.member.id);
          this.loadingService.hide();
        },
        error: () => {
          this.messageService.displayMessage('Dateien konnten nicht geladen werden.');
          this.loadingService.hide();
        }
      });
    } else {
      this.loadingService.hide();
    }
  }


  toggleEdit(field: keyof EditStates, newValue: string, userId: number): void {
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
        case 'cardnumber':
          this.saveCardNumber(changedMembersData);
          break;
        case 'visaormc':
          this.saveVisaOrMc(changedMembersData);
          break;
        case 'month':
          this.saveMonth(changedMembersData);
          break;
        case 'year':
          this.saveYear(changedMembersData);
          break;
        case 'cvc':
          this.saveCvc(changedMembersData);
          break;
        case 'nameoncard':
          this.saveNameOnCard(changedMembersData);
          break;
        case 'geb':
          this.saveGeb(changedMembersData);
          break;
        case 'plz':
          this.savePLZ(changedMembersData);
          break;
        case 'street':
          this.saveStreet(changedMembersData);
          break;
        case 'city':
          this.saveCity(changedMembersData);
          break;
        default:
          console.warn(`Save method not implemented for field: ${field}`);
      }
    }
  }

  saveUsername(changedMembersData: ChangedMembersData): void {
    this.loadingService.show();

    this.apiService.updateMemberUsername(changedMembersData).subscribe({
      next: (response: ApiResponse) => {
        this.loadingService.hide();
        this.messageService.displayMessage(response.message);
      },
      error: (error) => {
        this.loadingService.hide();
        this.messageService.displayMessage(error.message);
      }
    });
  }

  savePassword(changedMembersData: ChangedMembersData): void {
    this.loadingService.show();

    this.apiService.updateMemberPassword(changedMembersData).subscribe({
      next: (response: ApiResponse) => {
        this.loadingService.hide();
        this.messageService.displayMessage(response.message);
      },
      error: (error) => {
        this.loadingService.hide();
        this.messageService.displayMessage(error.message);
      }
    });
  }

  saveKundennummer(changedMembersData: ChangedMembersData): void {
    this.loadingService.show();

    this.apiService.updateMemberKundennummer(changedMembersData).subscribe({
      next: (response: ApiResponse) => {
        this.loadingService.hide();
        this.messageService.displayMessage(response.message);
      },
      error: (error) => {
        this.loadingService.hide();
        this.messageService.displayMessage(error.message);
      }
    });
  }

  saveMitgliedsnummer(changedMembersData: ChangedMembersData): void {
    this.loadingService.show();

    this.apiService.updateMemberMitgliedsnummer(changedMembersData).subscribe({
      next: (response: ApiResponse) => {
        this.loadingService.hide();
        this.messageService.displayMessage(response.message);
      },
      error: (error) => {
        this.loadingService.hide();
        this.messageService.displayMessage(error.message);
      }
    });
  }

  saveCardNumber(changedMembersData: ChangedMembersData): void {
    this.loadingService.show();

    this.apiService.updateMemberCardNumber(changedMembersData).subscribe({
      next: (response: ApiResponse) => {
        this.loadingService.hide();
        this.messageService.displayMessage(response.message);
      },
      error: (error) => {
        this.loadingService.hide();
        this.messageService.displayMessage(error.message);
      }
    });
  }

  saveVisaOrMc(changedMembersData: ChangedMembersData): void {
    this.loadingService.show();

    this.apiService.updateMemberVisaOrMc(changedMembersData).subscribe({
      next: (response: ApiResponse) => {
        this.loadingService.hide();
        this.messageService.displayMessage(response.message);
      },
      error: (error) => {
        this.loadingService.hide();
        this.messageService.displayMessage(error.message);
      }
    });
  }

  saveMonth(changedMembersData: ChangedMembersData): void {
    this.loadingService.show();

    this.apiService.updateMemberMonth(changedMembersData).subscribe({
      next: (response: ApiResponse) => {
        this.loadingService.hide();
        this.messageService.displayMessage(response.message);
      },
      error: (error) => {
        this.loadingService.hide();
        this.messageService.displayMessage(error.message);
      }
    });
  }

  saveYear(changedMembersData: ChangedMembersData): void {
    this.loadingService.show();

    this.apiService.updateMemberYear(changedMembersData).subscribe({
      next: (response: ApiResponse) => {
        this.loadingService.hide();
        this.messageService.displayMessage(response.message);
      },
      error: (error) => {
        this.loadingService.hide();
        this.messageService.displayMessage(error.message);
      }
    });
  }

  saveCvc(changedMembersData: ChangedMembersData): void {
    this.loadingService.show();

    this.apiService.updateMemberCvc(changedMembersData).subscribe({
      next: (response: ApiResponse) => {
        this.loadingService.hide();
        this.messageService.displayMessage(response.message);
      },
      error: (error) => {
        this.loadingService.hide();
        this.messageService.displayMessage(error.message);
      }
    });
  }

  saveNameOnCard(changedMembersData: ChangedMembersData): void {
    this.loadingService.show();

    this.apiService.updateMemberNameOnCard(changedMembersData).subscribe({
      next: (response: ApiResponse) => {
        this.loadingService.hide();
        this.messageService.displayMessage(response.message);
      },
      error: (error) => {
        this.loadingService.hide();
        this.messageService.displayMessage(error.message);
      }
    });
  }

  saveGeb(changedMembersData: ChangedMembersData): void {
    this.loadingService.show();

    this.apiService.updateMemberGeb(changedMembersData).subscribe({
      next: (response: ApiResponse) => {
        this.loadingService.hide();
        this.messageService.displayMessage(response.message);
      },
      error: (error) => {
        this.loadingService.hide();
        this.messageService.displayMessage(error.message);
      }
    });
  }

  savePLZ(changedMembersData: ChangedMembersData): void {
    this.loadingService.show();

    this.apiService.updateMemberPLZ(changedMembersData).subscribe({
      next: (response: ApiResponse) => {
        this.loadingService.hide();
        this.messageService.displayMessage(response.message);
      },
      error: (error) => {
        this.loadingService.hide();
        this.messageService.displayMessage(error.message);
      }
    });
  }

  saveStreet(changedMembersData: ChangedMembersData): void {
    this.loadingService.show();

    this.apiService.updateMemberStreet(changedMembersData).subscribe({
      next: (response: ApiResponse) => {
        this.loadingService.hide();
        this.messageService.displayMessage(response.message);
      },
      error: (error) => {
        this.loadingService.hide();
        this.messageService.displayMessage(error.message);
      }
    });
  }

  saveCity(changedMembersData: ChangedMembersData): void {
    this.loadingService.show();

    this.apiService.updateMemberCity(changedMembersData).subscribe({
      next: (response: ApiResponse) => {
        this.loadingService.hide();
        this.messageService.displayMessage(response.message);
      },
      error: (error) => {
        this.loadingService.hide();
        this.messageService.displayMessage(error.message);
      }
    });

    this.loadingService.hide();
  }

  loadPdf(memberId: number, fileName: string, game: string): void {
    const unsafeUrl = "https://durmex-app.onrender.com/members/" + memberId + "/" + fileName + "/" + game + "/preview";
    this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(unsafeUrl);
  }

  downloadFile(userId: number, fileName: string, game: string): void {
    this.loadingService.show();

    this.apiService.downloadFileByUserId(userId, fileName, game).subscribe({
      next:(blob) => {
        saveAs(blob, fileName);
        this.messageService.displayMessage("Datei " + fileName + " für " + userId + " erfolgereich heruntergeladen.");
        },
      error: () => this.messageService.displayMessage('Download Fehler!')
    });
  }

  deleteFile(userId: number, fileName: string, game: string): void {
    this.loadingService.show();

    this.apiService.deletePdfFileByMemberIdAndFileName(userId, fileName, game).subscribe({
      next: (respones) => {
        this.loadingService.hide();
        this.files = this.files.filter(item => item.fileName !== fileName);
        this.uniqueGameNames = this.resolveUniqueGames(this.files);
        this.messageService.displayMessage(respones.message);
        this.loadAllGamesFiles(this.uniqueGameNames, this.member.id);
      },
      error: (error) => {
        this.loadingService.hide();
        this.messageService.displayMessage(error.message);
      }
    });
  }

  uploadFile(): void {
    this.loadingService.show();
    let formData: any = new FormData();

    if(this.selectedGame !== '' && this.selectedFiles.length > 0) {
      formData.append('game', this.selectedGame);

      for (const file of this.selectedFiles) {
        formData.append('files', file);
      }

      this.apiService.uploadPdfFiles(formData, this.memberId).subscribe({
        next: (files) => {
          this.loadingService.hide();
          this.files = files;
          this.uniqueGameNames = this.resolveUniqueGames(this.files);
          this.loadAllGamesFiles(this.uniqueGameNames, this.member.id);
        },
        error: () => {
          this.loadingService.hide();
          this.messageService.displayMessage('Error!');
        }
      });
    } else if(this.selectedGame === '') {
      this.loadingService.hide();
      this.messageService.displayMessage('Fehler! Bitte das Spiel auswählen!');
    } else {
      this.loadingService.hide();
      this.messageService.displayMessage('Fehler! Bitte mindestens eine Datei auswählen!');
    }
    this.selectedGame = '';
    this.selectedFiles = [];
    (document.getElementById('fileInput') as HTMLInputElement).value = '';
  }

  loadAllGamesFiles(games: string[], memberId: number): void {
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

    this.games$ = forkJoin(gameFilesObservables).pipe(
        finalize(() => this.loadingService.hide())
    );
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
