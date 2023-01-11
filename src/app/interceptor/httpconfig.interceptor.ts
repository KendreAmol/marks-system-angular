import { Injectable } from '@angular/core';
import { ErrorDialogService } from '../services/errordialog.sercive'
import { HttpInterceptor, HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';

@Injectable()
export class HttpConfigInterceptor implements HttpInterceptor {
    constructor(private errorDialogService: ErrorDialogService,
        private router: Router,
        private authenticationService: AuthenticationService) { }


    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const timeStarted = Date.now();
        const token: string = localStorage.getItem('token');

        if (token) {
            request = request.clone({ headers: request.headers.set('Authorization', 'Bearer ' + token) });
        }

        if (!request.headers.has('Content-Type') && !(request.url == 'http://localhost:50299/api/image-uplaod')) {
            request = request.clone({ headers: request.headers.set('Content-Type', 'application/json') });
        }
        request = request.clone({ headers: request.headers.set('Accept', 'application/json') });

        return next.handle(request).pipe(
            map((event: HttpEvent<any>) => {
                if (event instanceof HttpResponse) {
                    // TODO: Proper Logging
                    const timeElapsed = Date.now() - timeStarted;
                    console.log(`Request for ${request.urlWithParams} took ${timeElapsed} ms to complete.`
                    );
                }
                return event;
            }),
            catchError((error: HttpErrorResponse) => {
                if (error instanceof HttpErrorResponse) {
                    if (error.status === 401) {
                        let data = {};
                        data = {
                            reason: 'token expired',
                            status: error.status
                        };
                        this.errorDialogService.openDialog(data);
                        this.authenticationService.logout();
                        this.router.navigate(["login"]);
                    }
                }
                return throwError(error);
            })
        );
    }


}