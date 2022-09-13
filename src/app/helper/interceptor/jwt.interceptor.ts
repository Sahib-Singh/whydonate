import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';

import { CommonService } from '../services/common.service';

@Injectable({
	providedIn: 'root'
})
export class JwtInterceptor implements HttpInterceptor {

	constructor(
		private common: CommonService) {
	}

	intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

		/**
		 * Do not let api to hit if Internet connection is not there.
		 */

		if (!navigator.onLine) {
			this.common.showSnackBar('Please connect to the internet first !', 3000)
			return;
		}

		/**
		 * Intercept the Autorization token to the api request, if token exist.
		 */

		const data = localStorage.getItem('whyDonate@Token');

		if (data) {
			request = request.clone({
				setHeaders: {
					Authorization: `Bearer ${JSON.parse(data).token}`
				}
			});
		}

		return next.handle(request).pipe(tap((event: HttpEvent<any>) => {
			if (event instanceof HttpResponse) {
				if (!event.body.status) {
					this.common.showSnackBar(event.body.message, 3000)
				}
			}
		}),
			catchError((response: any) => {
				if (response instanceof HttpErrorResponse) {
					return throwError(response);
				}
			})
		);
	}
}
