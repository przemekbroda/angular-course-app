import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpParams } from '@angular/common/http';
import { take, exhaustMap, map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

@Injectable()
export class AuthIntercepterService implements HttpInterceptor {
    isRefreshingToken = false;

    constructor(private authService: AuthService) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return this.authService.userSubject.pipe(take(1), exhaustMap(user => {
            if (!user) {
                return next.handle(req);
            }
            const modifiedRequest = req.clone({params: new HttpParams().set('auth', user.token)});
            return next.handle(modifiedRequest);
            // .pipe(catchError(err => {
            //     if (err) {
            //         //refresh token

            //     }
            //     return throwError(err);
            // }));
        }));
    }

    private getToken() {

    }

}
