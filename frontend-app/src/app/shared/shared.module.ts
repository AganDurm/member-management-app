import {NgModule} from '@angular/core';
import {CommonModule, LocationStrategy, PathLocationStrategy} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {RouterLink, RouterModule} from '@angular/router';
import {ApiService} from '../api/service/api.service';
import {LoadingService} from '../loading.service';
import {ResponseMessageService} from '../response-message.service';
import {HttpClientModule, provideHttpClient, withFetch} from '@angular/common/http';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    HttpClientModule,
  ],
  exports: [
    CommonModule,
    FormsModule,
    RouterModule,
    HttpClientModule,
    RouterLink
  ],
  providers: [
    ApiService,
    LoadingService,
    ResponseMessageService,
    {provide: LocationStrategy, useClass: PathLocationStrategy},
    provideHttpClient(withFetch())
  ],
})
export class SharedModule { }
