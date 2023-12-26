import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {HttpClientModule, provideHttpClient, withFetch} from '@angular/common/http';
import {AppComponent} from './app.component';
import {PreloaderComponent} from './preloader/preloader.component';
import {ApiService} from './api/service/api.service';
import {LoadingService} from './loading.service';
import {ResponseMessageService} from './response-message.service';
import {UploaderComponent} from './uploader/uploader.component';
import {AppRoutingModule} from './app-routing.module';
import {SharedModule} from './shared/shared.module';
import {FilterMembers} from './filter-members.pipe';
import {FilterUserFile} from './filter-user-file.pipe';
import {MembersComponent} from './members/members.component';
import {MemberDetailComponent} from './member-detail/member-detail.component';
import { PathLocationStrategy, LocationStrategy } from '@angular/common';
import {RouterLink} from '@angular/router';

@NgModule({
  declarations: [
    AppComponent,
    PreloaderComponent,
    UploaderComponent,
    FilterMembers,
    FilterUserFile,
    MembersComponent,
    MemberDetailComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    SharedModule,
  ],
  exports: [
    SharedModule,
    RouterLink
  ],
  providers: [
    ApiService,
    LoadingService,
    ResponseMessageService,
    {provide: LocationStrategy, useClass: PathLocationStrategy},
    provideHttpClient(withFetch())
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
