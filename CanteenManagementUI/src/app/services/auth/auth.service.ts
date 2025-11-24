import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AuthUtils } from 'src/app/services/auth/auth.utils';
import { BehaviorSubject } from 'rxjs';
import { SecureStorageService } from 'src/app/services/secure-storage.service';


@Injectable()
export class AuthService {
  private _authenticated: boolean = false;
  isLoggedIn = new BehaviorSubject<boolean>(false);
  constructor(private _httpClient: HttpClient,private secureStore: SecureStorageService) {
    // Restore login state from localStorage if available
    const savedUser = this.secureStore.getItem<any>('user');
    if (savedUser) this._authenticated = true;
  }

  set authenticated(key: string) {
    this.secureStore.setItem('authenticated', key);
  }

  get authenticated(): string {
    return this.secureStore.getItem<any>('authenticated') ?? 'false';
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
  signIn(model:any): Observable<any> {
    //this.authenticated = 'true';
    //this.userid ="1";
     return this._httpClient.post(`${environment.apiUrl}/Canteen/login`, model).pipe(
      switchMap((response: any) => {

        if (response.success) {
          // Set the authenticated flag to true
         // this._authenticated = true;
          // Save user info in localStorage
          const userData = {
            account_id: response.account_id,
            user_name: model.username,
            usertype: response.account_type_name ,
            isAdmin:response.account_id===1 || model.username.toLocaleLowerCase()=='canteen'
          };
          this.secureStore.setItem('user', JSON.stringify(userData));
        }
        return of(response);
      })
    );
  }

  getUser(): { account_id: number; user_name: string; usertype:string; } {

    const savedUser = this.secureStore.getItem<any>('user');
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
    this.secureStore.removeItem('orderCounts');
    this.secureStore.removeItem('user');
    return of(true);
  }

  removeToken() {
    this.secureStore.removeItem('orderCounts');
    this.secureStore.removeItem('user');
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
