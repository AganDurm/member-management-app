import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {ApiService} from '../api/service/api.service';
import {LoadingService} from '../loading.service';
import {ResponseMessageService} from '../response-message.service';
import {HttpClientModule, provideHttpClient, withFetch} from '@angular/common/http';


@NgModule({
  imports: [
    HttpClientModule,
    CommonModule,
    FormsModule,
    RouterModule
  ],
  exports: [
    HttpClientModule,
    CommonModule,
    FormsModule,
    RouterModule
  ],
  providers: [
    ApiService,
    LoadingService,
    ResponseMessageService,
    provideHttpClient(withFetch())
  ],
})
export class SharedModule { }
