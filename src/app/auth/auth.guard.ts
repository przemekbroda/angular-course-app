import { CanActivate, CanActivateChild, Router } from '@angular/router';
import { Inject, Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { take, map, exhaustMap } from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class AuthGuard implements CanActivate, CanActivateChild {

    constructor(private authService: AuthService, private router: Router) { }

    canActivate(route: import("@angular/router").ActivatedRouteSnapshot, state: import("@angular/router").RouterStateSnapshot): boolean | import("@angular/router").UrlTree | import("rxjs").Observable<boolean | import("@angular/router").UrlTree> | Promise<boolean | import("@angular/router").UrlTree> {
        return this.authService.userSubject.pipe(take(1), map(user => {
            const isAuth = !!user;
            if (isAuth) {
                return true;
            } else {
                return this.router.createUrlTree(['/auth']);
            }
        }));
    }

    canActivateChild(childRoute: import("@angular/router").ActivatedRouteSnapshot, state: import("@angular/router").RouterStateSnapshot): boolean | import("@angular/router").UrlTree | import("rxjs").Observable<boolean | import("@angular/router").UrlTree> | Promise<boolean | import("@angular/router").UrlTree> {
        return this.authService.userSubject.pipe(take(1), map(user => {
            const isAuth = !!user;
            if (isAuth) {
                return true;
            } else {
                this.router.createUrlTree(['/auth']);
            }
        }));
    }



}
