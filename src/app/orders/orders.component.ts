import {Component, OnDestroy, OnInit} from '@angular/core';
import {ApiService} from '../api/service/api.service';
import {ResponseMessageService} from '../response-message.service';
import {LoadingService} from '../loading.service';
import {Subscription} from 'rxjs';
import {Orders} from '../model/orders';
import {ApiResponse} from '../api/models/api-response';
import {File} from '../model/file';
import {saveAs} from 'file-saver';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.less'
})
export class OrdersComponent implements OnInit, OnDestroy {
  pdfUrl: SafeResourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl("");
  game: string = '';
  isLoading: boolean = false;
  messages: string[] = [];
  orders: Orders[] = [];

  files: File[] = [];

  private ordersSubscription: Subscription = new Subscription();
  private messageSubscription: Subscription = new Subscription();
  private loadingSubscription: Subscription = new Subscription();

  constructor(private apiService: ApiService,
              private loadingService: LoadingService,
              private messageService: ResponseMessageService,
              private sanitizer: DomSanitizer) {}

  ngOnInit() {
    this.loadingService.show();

    this.messageSubscription = this.messageService.getMessages().subscribe(messages => this.messages = messages);
    this.loadingSubscription = this.loadingService.loading$.subscribe(isLoading => this.isLoading = isLoading);
    this.fetchOrders();
    this.apiService.findAllPdfFiles().subscribe({
      next: (files: File[]) => {
        this.loadingService.hide();
        this.files = files;
      },
      error: () => {
        this.loadingService.hide();
        this.messageService.displayMessage('Dateien konnten nicht geladen werden.');
      }
    });
  }

  addNewGame(): void {
    if (this.game) {
      let newGame: Orders = new Orders(this.game, 0,0,0,0,0,0, 0, 0, 0,0);
      this.apiService.saveNewOrder(newGame).subscribe({
        next: (response: ApiResponse) => {
          this.messageService.displayMessage(response.message);
          this.fetchOrders();
        },
        error: (error) => this.messageService.displayMessage(error.message)
      });
      this.game = '';
    }
  }

  fetchOrders(): void {
    this.ordersSubscription = this.apiService.findAllOrders().subscribe((data: Orders[]) => {
      this.orders = data.reverse();
    });
  }

  decrementKat4hunderts(game: Orders): void {
    if (game.kat4hunderts > 0) {
      game.kat4hunderts--;
    }
  }

  incrementKat4hunderts(game: Orders): void {
    game.kat4hunderts++;
  }

  decrementKat1single(game: Orders): void {
    if (game.kat1single > 0) {
      game.kat1single--;
    }
  }

  incrementKat1single(game: Orders): void {
    game.kat1single++;
  }

  decrementKat2single(game: Orders): void {
    if (game.kat2single > 0) {
      game.kat2single--;
    }
  }

  incrementKat2single(game: Orders): void {
    game.kat2single++;
  }

  decrementKat3single(game: Orders): void {
    if (game.kat3single > 0) {
      game.kat3single--;
    }
  }

  incrementKat3single(game: Orders): void {
    game.kat3single++;
  }

  decrementKat4single(game: Orders): void {
    if (game.kat4single > 0) {
      game.kat4single--;
    }
  }

  incrementKat4single(game: Orders): void {
    game.kat4single++;
  }

  decrementKat4platinum(game: Orders): void {
    if (game.kat4platinum > 0) {
      game.kat4platinum--;
    }
  }

  incrementKat4platinum(game: Orders): void {
    game.kat4platinum++;
  }

  decrementKat4(game: Orders): void {
    if (game.kat4 > 0) {
      game.kat4--;
    }
  }

  getFilesByName(game: string): File[] {
    return this.files.filter(file => file.game.toLowerCase() === game.toLowerCase());
  }

  incrementKat4(game: Orders): void {
    game.kat4++;
  }

  decrementKat3(game: Orders): void {
    if (game.kat3 > 0) {
      game.kat3--;
    }
  }

  incrementKat3(game: Orders): void {
    game.kat3++;
  }

  decrementKat2(game: Orders): void {
    if (game.kat2 > 0) {
      game.kat2--;
    }
  }

  incrementKat2(game: Orders): void {
    game.kat2++;
  }

  decrementKat1(game: Orders): void {
    if (game.kat1 > 0) {
      game.kat1--;
    }
  }

  incrementKat1(game: Orders): void {
    game.kat1++;
  }

  saveChanges(game: Orders): void {
    this.apiService.updateOrder(game).subscribe({
      next: (response: ApiResponse) => this.messageService.displayMessage(response.message),
      error: (error) => this.messageService.displayMessage(error.message)
    });
  }

  deleteById(gameId: number): void {
    this.apiService.deleteOrderById(gameId).subscribe({
      next: (response: ApiResponse) => {
        this.messageService.displayMessage(response.message);
        this.fetchOrders();
      },
      error: (error) => this.messageService.displayMessage(error.message)
    });
  }

  downloadFile(fileName: string, game: string): void {
    this.loadingService.show();

    this.apiService.downloadFileByUserId(0, fileName, game).subscribe({
      next:(blob) => {
        this.loadingService.hide();
        saveAs(blob, fileName);
        this.messageService.displayMessage("Datei " + fileName + " für das Spiel " + game + " erfolgereich heruntergeladen.");
      },
      error: () => {
        this.loadingService.hide();
        this.messageService.displayMessage('Download Fehler!');
      }
    });
  }

  loadPdf(fileName: string, game: string): void {
    const unsafeUrl = "https://durmex-app.onrender.com/members/" + 0 + "/" + fileName + "/" + game + "/preview";
    this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(unsafeUrl);
  }

  downloadFilesByGame(game: string): void {
    this.loadingService.show();

    this.apiService.downloadAllFilesByGameName(game).subscribe({
      next:(blob) => {
        this.loadingService.hide();
        saveAs(blob, `${game}.zip`);
        this.messageService.displayMessage("Tickets für das Spiel " + game + " erfolgereich heruntergeladen.");
      },
      error: () => {
        this.loadingService.hide();
        this.messageService.displayMessage('Download Fehler!');
      }
    });
  }

  ngOnDestroy() {
    if (this.ordersSubscription) {
      this.ordersSubscription.unsubscribe();
    }
    if (this.messageSubscription) {
      this.messageSubscription.unsubscribe();
    }
    if (this.loadingSubscription) {
      this.loadingSubscription.unsubscribe();
    }
  }
}
