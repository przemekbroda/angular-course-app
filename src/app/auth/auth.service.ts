import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap, take, exhaustMap } from 'rxjs/operators';
import { throwError, Subject, BehaviorSubject} from 'rxjs';
import { User } from './user.model';
import { TouchSequence } from 'selenium-webdriver';

export interface OnResponseData {
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
    registered?: boolean;
}

@Injectable({providedIn: 'root'})
export class AuthService {
    userSubject = new BehaviorSubject<User>(null);
    private tokenExpirationTimer: any;

    constructor(private http: HttpClient) { }

    signUp(email: string, password: string) {
        return this.http.post<OnResponseData>(
            'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDWY2QjMBzlg9a-LqymplbsJPek995oIs4',
            {
                email: email,
                password: password,
                returnSecureToken: true
            }).pipe(catchError(this.handleError), tap(this.handleAuthentication));
    }

    login(email: string, password: string) {
        return this.http.post<OnResponseData>(
            'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDWY2QjMBzlg9a-LqymplbsJPek995oIs4',
            {
                email: email,
                password: password,
                returnSecureToken: true
            }
        ).pipe(catchError(this.handleError), tap(resData => {
            this.handleAuthentication(resData);
        }));
    }

    refreshToken() {
        // this.userSubject.pipe(take(1), exhaustMap(user => {
        //     return this.http.post<OnResponseData>('https://securetoken.googleapis.com/v1/token?key=AIzaSyDWY2QjMBzlg9a-LqymplbsJPek995oIs4', {
        //     grant_type: 'refresh_token',
        //     refresh_token:
        // }).pipe(tap(resData => {
        //     this.handleAuthentication(resData);
        // }));
        // }));
    }

    logout() {
        this.userSubject.next(null);
        localStorage.removeItem('userData');
        if (this.tokenExpirationTimer) {
            clearTimeout(this.tokenExpirationTimer);
        }

        this.tokenExpirationTimer = null;
    }

    autoLogout(expirationDuration: number) {
        this.tokenExpirationTimer = setTimeout(() => {
            this.logout();
        }, 3600000);
    }

    autologin() {
        const userData: {
            email: string;
            id: string;
            _token: string;
            _tokenexpirationdate: string;
        } = JSON.parse(localStorage.getItem('userData'));
        if (!userData) {
            return;
        }

        const loadedUser = new User(userData.email, userData.id, userData._token, new Date(userData._tokenexpirationdate));
        if (loadedUser.token) {
            this.userSubject.next(loadedUser);
            this.autoLogout(new Date(userData._tokenexpirationdate).getTime() - new Date().getTime());
        }
    }

    private handleAuthentication(resData: OnResponseData) {
        const expirationDate = new Date(new Date().getTime() + +resData.expiresIn * 1000);
        const user = new User(resData.email, resData.localId, resData.idToken, expirationDate);
        this.userSubject.next(user);
        this.autoLogout(+resData.expiresIn * 1000);
        localStorage.setItem('userData', JSON.stringify(user));
    }

    private handleError(errorRes: HttpErrorResponse) {
        let errorMessage = 'An unknown error occured';
        console.log(errorRes.error.error.message);
        if (!errorRes.error || !errorRes.error.error) {
            return throwError(errorMessage);
        }
        switch (errorRes.error.error.message) {
            case 'EMAIL_EXISTS':
                errorMessage = 'This email already exists';
                break;
            case 'EMAIL_NOT_FOUND':
                errorMessage = 'This email does not exist';
                break;
            case 'INVALID_PASSWORD':
                errorMessage = 'Wrong Password';
                break;
        }
        return throwError(errorMessage);
    }
}
