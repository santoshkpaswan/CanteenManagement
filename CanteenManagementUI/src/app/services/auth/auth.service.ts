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

  set authenticated(key: string) {
    localStorage.setItem('authenticated', key);
  }

  get authenticated(): string {
    return localStorage.getItem('authenticated') ?? 'false';
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

  /**
   * Sign in
   *
   * @param credentials
   */
  signIn(credentials: { user_name: string; password: string }): Observable<any> {

    // Throw error, if the user is already logged in
    //if (this._authenticated) {
    //  return throwError('User is already logged in.');
    //}

    //this.authenticated = 'true';
    //this.userid ="1";
    return this._httpClient.post(`${environment.apiLoginUrl}/Account/Autentication?APIKey=651cb656-1fde-478d-badf-33f60553f36e`, credentials).pipe(
      switchMap((response: any) => {

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
    localStorage.removeItem('orderCounts');
    localStorage.removeItem('user');
    return of(true);
  }

  removeToken() {
    localStorage.removeItem('orderCounts');
    localStorage.removeItem('user');
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
    else{
      return of(false);
    }

  }

}
