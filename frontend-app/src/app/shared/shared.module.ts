import {NgModule} from '@angular/core';
import {CommonModule, LocationStrategy, PathLocationStrategy} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {RouterLink, RouterModule, RouterOutlet} from '@angular/router';
import {ApiService} from '../api/service/api.service';
import {LoadingService} from '../loading.service';
import {ResponseMessageService} from '../response-message.service';
import {HttpClientModule, provideHttpClient, withFetch} from '@angular/common/http';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    RouterModule
  ],
  exports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    RouterModule,
    RouterLink,
    RouterOutlet
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
