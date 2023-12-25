import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BrowserModule} from '@angular/platform-browser';
import {ServerModule} from '@angular/platform-server';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule} from '@angular/forms';
import {AppComponent} from './app.component';
import {PreloaderComponent} from './preloader/preloader.component';
import {ApiService} from './api/service/api.service';
import {LoadingService} from './loading.service';
import {ResponseMessageService} from './response-message.service';
import {UploaderComponent} from './uploader/uploader.component';
import {MembersComponent} from './members/members.component';
import {MemberDetailComponent} from './member-detail/member-detail.component';
import {FilterUserFile} from './filter-user-file.pipe';
import {FilterMembers} from './filter-members.pipe';
import {AppRoutingModule} from './app-routing.module';

@NgModule({
  declarations: [
    AppComponent,
    PreloaderComponent,
    UploaderComponent,
    MembersComponent,
    MemberDetailComponent,
    FilterUserFile,
    FilterMembers
  ],
  imports: [
    AppRoutingModule,
    FormsModule,
    BrowserModule,
    CommonModule,
    HttpClientModule,
    ServerModule,
  ],
  exports: [FormsModule, CommonModule],
  providers: [ApiService, LoadingService, ResponseMessageService],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
