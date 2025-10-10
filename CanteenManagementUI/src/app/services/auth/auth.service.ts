import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AuthUtils } from 'src/app/services/auth/auth.utils';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class AuthService {
  private _authenticated: boolean = false;
  isLoggedIn = new BehaviorSubject<boolean>(false);
  constructor(private _httpClient: HttpClient) {
    // Restore login state from localStorage if available
    const savedUser = localStorage.getItem('user');
    if (savedUser) this._authenticated = true;
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------

  /**
   * Setter & getter for access token
   */
  set accessToken(token: string) {
    localStorage.setItem('AccessToken', token);
  }

  get accessToken(): string {
    return localStorage.getItem('AccessToken') ?? '';
  }

  set authenticated(key: string) {
    localStorage.setItem('authenticated', key);
  }

  get authenticated(): string {
    return localStorage.getItem('authenticated') ?? 'false';
  }

  set userid(token: string) {
    localStorage.setItem('UserID', token);
  }

  get userid(): string {
    return localStorage.getItem('UserID') ?? '';
  }

  set rgenId(token: string) {
    localStorage.setItem('RgenID', token);
  }
  get rgenId(): string {
    return localStorage.getItem('RgenID') ?? '';
  }

  set user_name(value: string) {
    localStorage.setItem('user_name', value);
  }
  get user_name(): string {
    return localStorage.getItem('user_name') ?? '';
  }
  set usertype(value: string) {
    localStorage.setItem('UserType', value);
  }

  get usertype(): string {
    return localStorage.getItem('UserType') ?? '';
  }

  set role(token: string) {
    localStorage.setItem('Role', token);
  }

  get role(): string {
    return localStorage.getItem('Role') ?? '';
  }

  get isAdmin(): boolean {
    return this.getUser().usertype.toLowerCase() === 'admin';
  }

  get accountId(): number {
    return this.getUser().account_id;
  }
  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  validateEmail(credentials: any): Observable<any> {
    return this._httpClient.post(`${environment.apiUrl}/Account/ValidateEmailId`, credentials).pipe(
      switchMap((response: any) => {
        return of(response);
      })
    );
  }

  validateSSOAccessToken(credentials: any): Observable<any> {
    return this._httpClient.post(`${environment.apiUrl}/Account/SSOSignin`, credentials).pipe(
      switchMap((response: any) => {

        if (response.isSuccess) {
          this.accessToken = response.jwtToken;
          this.authenticated = 'true';
          // ===================================
          localStorage.setItem("Role", response.role);
          localStorage.setItem("UserID", response.userName);
        }
        return of(response);
      })
    );
  }

  /**
   * Sign in
   *
   * @param credentials
   */
  signIn(credentials: { user_name: string; password: string }): Observable<any> {
    debugger
    // Throw error, if the user is already logged in
    //if (this._authenticated) {
    //  return throwError('User is already logged in.');
    //}
    debugger
    //this.authenticated = 'true';
    //this.userid ="1";
    return this._httpClient.post(`${environment.apiLoginUrl}/Account/Autentication?APIKey=651cb656-1fde-478d-badf-33f60553f36e`, credentials).pipe(
      switchMap((response: any) => {
        debugger
        if (response.response_id == 1) {
          // Set the authenticated flag to true
          this._authenticated = true;
          // Save user info in localStorage
          const userData = {
            account_id: response.account_id,
            user_name: credentials.user_name,
            usertype: response.account_type_name ,
          };
          localStorage.setItem('user', JSON.stringify(userData));
        }
        return of(response);
      })
    );
  }

  getUser(): { account_id: number; user_name: string; usertype:string; } {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      return JSON.parse(savedUser);
    }
    // Return default values instead of null
    return { account_id: 0, user_name: '', usertype:'' };
  }

  /**
   * Sign out
   */
  signOut(): Observable<any> {
    // Remove the access token from the local storage
    localStorage.removeItem('AccessToken');
    localStorage.removeItem('authenticated');
    localStorage.removeItem('UserID');
    localStorage.removeItem('RgenID');
    localStorage.removeItem('user_name');
    localStorage.removeItem('UserType');
    return of(true);
  }

  signInUsingToken(): Observable<any> {
    // Renew token

    return this._httpClient.post('api/auth/refresh-access-token', {
      accessToken: this.accessToken
    }).pipe(
      catchError((error: any) =>
        // Return false
        of(false)
      ),
      switchMap((response: any) => {

        // Store the access token in the local storage
        this.accessToken = response.accessToken;

        // Set the authenticated flag to true
        this.authenticated = 'true';

        // Return true
        return of(true);
      })
    );
  }

  removeToken() {
    localStorage.removeItem('AccessToken');
    localStorage.removeItem('Role');
    localStorage.removeItem("authenticated");
    localStorage.removeItem("UserID");
    this.isLoggedIn.next(false);
  }

  /**
   * Check the authentication status
   */
  check(): Observable<boolean> {
    // Check if the user is logged in
    if (this.authenticated == 'true') {
      return of(true);
    }

    // Check the access token availability
    if (this.accessToken == 'false') {
      return of(false);
    }

    if (AuthUtils.isTokenExpired(this.accessToken)) {
      return of(false);
    }

    //return of(true);
    // If the access token exists and it didn't expire, sign in using it
    return this.signInUsingToken();
  }

}
