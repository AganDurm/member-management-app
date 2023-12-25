import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {Member} from '../model/member';
import {ApiService} from '../api/service/api.service';
import {LoadingService} from '../loading.service';
import {ResponseMessageService} from '../response-message.service';
import {ApiResponse} from '../api/models/api-response';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-members',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './members.component.html',
  styleUrl: './members.component.less'
})
export class MembersComponent implements OnInit, OnDestroy {
  members: Member[] = [];
  filteredMembers: Member[] = [];

  messages: string[] = [];
  searchText: string = '';
  activeFilter: boolean = false;
  inactiveFilter: boolean = false;
  isLoading: boolean = false;

  private subscription!: Subscription;
  private messageSubscription!: Subscription;
  private loadingSubscription!: Subscription;

  constructor(private router: Router,
              private apiService: ApiService,
              private loadingService: LoadingService,
              private messageService: ResponseMessageService) {
  }

  ngOnInit() {
    this.loadingService.show();

    this.messageSubscription = this.messageService.getMessages().subscribe(messages => this.messages = messages);
    this.loadingSubscription = this.loadingService.loading$.subscribe(isLoading => this.isLoading = isLoading);

    this.subscription = this.apiService.findAll().subscribe((data: Member[]) => {
      this.members = data;
      this.filteredMembers = this.members;
      if (this.members.length === 0) {
        this.router.navigate(['/upload']).then(() => {});
      }
    });

    this.loadingService.hide();
  }

  toggleActiveFilter(): void {
    this.activeFilter = !this.activeFilter;
    if (this.activeFilter) {
      this.inactiveFilter = false;
    }
    this.filterMembers();
  }

  toggleInactiveFilter(): void {
    this.inactiveFilter = !this.inactiveFilter;
    if (this.inactiveFilter) {
      this.activeFilter = false;
    }
    this.filterMembers();
  }

  filterMembers(): void {
    if (this.activeFilter && this.inactiveFilter) {
      this.filteredMembers = this.members;
    } else if (this.activeFilter) {
      this.filteredMembers = this.members.filter((member) => member.active);
    } else if (this.inactiveFilter) {
      this.filteredMembers = this.members.filter((member) => !member.active);
    } else {
      this.filteredMembers = this.members;
    }
  }

  toggleMemberActiveStatus(member: Member): void {
    member.active = !member.active;
    this.apiService.updateMemberActiveStatus(member.id).pipe().subscribe({
      next: (response: ApiResponse) => {
        this.messageService.displayMessage(response.message);
        this.filterMembers();
      },
      error: (error) => this.messageService.displayMessage(error.message)
    });
  }

  deleteMember(memberId: string): void {
    this.loadingService.show();

    this.apiService.deleteMemberById(memberId).pipe().subscribe({
      next: () => {
        this.members = this.members.filter((member: Member) => member.id !== memberId);
        this.filteredMembers = this.members;
        this.messageService.displayMessage("Mitglied: " + memberId + " gelöscht!");
      },
      error: () => this.messageService.displayMessage('Mitglied nicht gelöscht!')
    });

    this.loadingService.hide();
  }

  deleteAllMembers(): void {
    this.loadingService.show();

    this.apiService.deleteAllMembers().pipe().subscribe({
      next: (data: ApiResponse) => {
        this.filteredMembers = [];
        this.messageService.displayMessage(data.message);
        this.router.navigate(['/upload']).then(() => {});
      },
      error: (error) => this.messageService.displayMessage(error.message)

  });

    this.loadingService.hide();
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.messageSubscription) {
      this.messageSubscription.unsubscribe();
    }
    if (this.loadingSubscription) {
      this.loadingSubscription.unsubscribe();
    }
  }
}
