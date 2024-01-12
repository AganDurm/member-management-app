import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import {ResponseMessageService} from './response-message.service';

@Injectable()
export class GlobalHttpInterceptorService implements HttpInterceptor {

    constructor(private messageService: ResponseMessageService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler) {
        return next.handle(req).pipe(
            catchError((error: HttpErrorResponse) => {
                this.messageService.displayMessage('Server returned code: ' + error.status);
                return throwError(() => error);
            })
        );
    }
}