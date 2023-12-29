import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http';
import {AppComponent} from './app.component';
import {PreloaderComponent} from './preloader/preloader.component';
import {ApiService} from './api/service/api.service';
import {LoadingService} from './loading.service';
import {ResponseMessageService} from './response-message.service';
import {UploaderComponent} from './uploader/uploader.component';
import {AppRoutingModule} from './app-routing.module';
import {FilterMembers} from './filter-members.pipe';
import {MembersComponent} from './members/members.component';
import {MemberDetailComponent} from './member-detail/member-detail.component';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';


@NgModule({
  declarations: [
    AppComponent,
    PreloaderComponent,
    UploaderComponent,
    FilterMembers,
    MembersComponent,
    MemberDetailComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    CommonModule,
  ],
  providers: [
    ApiService,
    LoadingService,
    ResponseMessageService
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
