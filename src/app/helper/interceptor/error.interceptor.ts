import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CommonService } from '../services/common.service';

@Injectable({
    providedIn: 'root'
})
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private commonSrvc: CommonService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        /**
         * Error interceptor for handling errors.
         */

        return next.handle(request).pipe(catchError(err => {

            if (err.status === 401) {
                // Auto logout if 401 response returned from api
                this.commonSrvc.showSnackBar(err.error.message, 3000)

            } else if (err.status === 400) {

                this.commonSrvc.showSnackBar(err.error.message, 3000)

            } else if (err.status === 404) {
            }
            const error = err.error.message || err.statusText;
            return throwError(error);
        }));
    }
}