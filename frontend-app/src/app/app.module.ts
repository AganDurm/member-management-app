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



@NgModule({
  declarations: [
    PreloaderComponent,
    UploaderComponent,
    FilterMembers,
    FilterUserFile,
    MembersComponent,
    MemberDetailComponent,
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    SharedModule,
    AppRoutingModule
  ],
  exports: [
    SharedModule
  ],
  providers: [
    ApiService,
    LoadingService,
    ResponseMessageService,
    provideHttpClient(withFetch())
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
