import {AppComponent} from './app.component';

import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppRoutingModule} from './app-routing.module';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';

import {UploaderComponent} from './uploader/uploader.component';
import {PreloaderComponent} from './preloader/preloader.component';
import {MembersComponent} from './members/members.component';
import {MemberDetailComponent} from './member-detail/member-detail.component';

import {LoadingService} from './preloader/service/loading.service';
import {ApiService} from './api/service/api.service';

import {FilterUserFilePipe} from './pipes/filter-user-file.pipe';
import {FilterMembersPipe} from './pipes/filter-members.pipe';
import {ResponesMessageService} from './respones-message.service';


@NgModule({
  declarations: [
    AppComponent,
    UploaderComponent,
    PreloaderComponent,
    MembersComponent,
    MemberDetailComponent,
    FilterUserFilePipe,
    FilterMembersPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    CommonModule,
    FormsModule
  ],
  providers: [ApiService, LoadingService, ResponesMessageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
