import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, switchMap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Subject } from 'rxjs';
import { SecureStorageService } from 'src/app/services/secure-storage.service';

@Injectable({
  providedIn: 'root'
})
export class CanteenService {
  private _refresh$ = new Subject<void>();
  constructor(private _httpClient: HttpClient,private secureStore: SecureStorageService) { }

  //  Helper to get RgenID as a number from localStorage
  private get loginUserId(): number {

    const userStr = this.secureStore.getItem<any>('user');
    if (!userStr) {
      console.error('User not found in localStorage');
      return 0;
    }
    try {
      const user = JSON.parse(userStr);
      return Number(user.account_id) || 0; // convert to number
    } catch (e) {
      console.error('Error parsing user JSON from localStorage', e);
      return 0;
    }
  }
  private get loginIsAdmin(): boolean {

    const userStr = this.secureStore.getItem<any>('user');
    if (!userStr) {
      console.error('User not found in localStorage');
      return false;
    }
    try {
      const user = JSON.parse(userStr);
      return user.isAdmin; // convert to number
    } catch (e) {
      console.error('Error parsing user JSON from localStorage', e);
      return false;
    }
  }
  private get loginUserType(): string {
    const userStr = this.secureStore.getItem<any>('user');
    if (!userStr) {
      console.error('User type not found in localStorage');
      return '';
    }
    try {
      const user = JSON.parse(userStr);
      return user.usertype || ''; // returns 'Staff', 'Admin', etc.
    } catch (e) {
      console.error('Error parsing user type JSON from localStorage', e);
      return '';
    }
  }

  private get loginUserName(): string {
    const userStr = this.secureStore.getItem<any>('user');
    if (!userStr) {
      console.error('User type not found in localStorage');
      return '';
    }
    try {
      const user = JSON.parse(userStr);
      return user.user_name || ''; // returns 'Staff', 'Admin', etc.
    } catch (e) {
      console.error('Error parsing user type JSON from localStorage', e);
      return '';
    }
  }

  getFoodDays(): Observable<any> {

    return this._httpClient.get(`${environment.apiUrl}/Canteen/ListFoodDay`, {}).pipe(
      switchMap((response: any) => {
        return of(response);
      })
    );
  }

  addFoodDay(model: any): Observable<any> {
    return this._httpClient.post(`${environment.apiUrl}/Canteen/SaveFoodDay`, model).pipe(
      switchMap((response: any) => {
        return of(response);
      })
    );
  }

  updateFoodDay(model: any): Observable<any> {
    return this._httpClient.post(`${environment.apiUrl}/Canteen/UpdateFoodDay`, model).pipe(
      switchMap((response: any) => {
        return of(response);
      })
    );
  }

  deleteFoodDay(id: any): Observable<any> {
    return this._httpClient.post(`${environment.apiUrl}/Canteen/DeleteFoodDay/${id}`, {}).pipe(
      switchMap((response: any) => {
        return of(response);
      })
    );
  }

  getFoodMenuItem(): Observable<any> {
    return this._httpClient.get(`${environment.apiUrl}/Canteen/ListFoodMenuItem`, {}).pipe(
      switchMap((response: any) => {
        return of(response);
      })
    );
  }

  addFoodMenuItem(model: any): Observable<any> {

    return this._httpClient.post(`${environment.apiUrl}/Canteen/SaveFoodMenuItem`, model).pipe(
      switchMap((response: any) => {
        return of(response);
      })
    );
  }

  updateFoodMenuItem(model: any): Observable<any> {
    return this._httpClient.post(`${environment.apiUrl}/Canteen/UpdateFoodMenuItem`, model).pipe(
      switchMap((response: any) => {
        return of(response);
      })
    );
  }

  deleteFoodMenuItem(id: any): Observable<any> {
    return this._httpClient.post(`${environment.apiUrl}/Canteen/DeleteFoodMenuItem/${id}`, {}).pipe(
      switchMap((response: any) => {
        return of(response);
      })
    );
  }

  getFoodItemPrice(): Observable<any> {

    return this._httpClient.get(`${environment.apiUrl}/Canteen/ListFoodMenuItemPrice`, {}).pipe(
      switchMap((response: any) => {
        return of(response);
      })
    );
  }

  getAcademicSession(): Observable<any> {
    return this._httpClient.get(`${environment.apiLoginUrl}/Account/CurrentSession?APIKey=651cb656-1fde-478d-badf-33f60553f36e`, {}).pipe(
      switchMap((response: any) => {
        return of(response);
      })
    );


  }

  addFoodItemPrice(model: any): Observable<any> {

    return this._httpClient.post(`${environment.apiUrl}/Canteen/SaveFoodMenuItemPrice`, model).pipe(
      switchMap((response: any) => {
        return of(response);
      })
    );
  }
  updateItemPrice(model: any): Observable<any> {
    return this._httpClient.post(`${environment.apiUrl}/Canteen/UpdateFoodMenuItemPrice`, model).pipe(
      switchMap((response: any) => {
        return of(response);
      })
    );
  }

  deleteItemPrice(id: any): Observable<any> {

    return this._httpClient.post(`${environment.apiUrl}/Canteen/DeleteFoodMenuItemPrice/${id}`, {}).pipe(
      switchMap((response: any) => {
        return of(response);
      })
    );
  }
  getDayWiseFoodItem(): Observable<any> {

    return this._httpClient.get(`${environment.apiUrl}/Canteen/ListDayWiseFoodMenuItem`, {}).pipe(
      switchMap((response: any) => {
        return of(response);
      })
    );
  }

  addDayWiseFoodItem(model: any): Observable<any> {
    return this._httpClient.post(`${environment.apiUrl}/Canteen/SaveDayWiseFoodMenuItem`, model).pipe(
      switchMap((response: any) => {
        return of(response);
      })
    );
  }

  updateDayWiseItem(model: any): Observable<any> {

    return this._httpClient.post(`${environment.apiUrl}/Canteen/UpdateDayWiseFoodMenuItem`, model).pipe(
      switchMap((response: any) => {
        return of(response);
      })
    );
  }

  deleteDayWiseItem(id: any): Observable<any> {

    return this._httpClient.post(`${environment.apiUrl}/Canteen/DeleteDayWiseFoodMenuItem/${id}`, {}).pipe(
      switchMap((response: any) => {
        return of(response);
      })
    );
  }

  getOrder(modal:any): Observable<any> {
    //const rgenId = localStorage.getItem('RgenID');
    const rgenId = this.loginUserId;
    //const userType = this.loginUserType;
    //const username = this.loginUserName
    const isAdmin = this.loginIsAdmin
    return this._httpClient.post(`${environment.apiUrl}/Canteen/ListOrder?rgenId=${rgenId} &isAdmin=${isAdmin}`, modal)
    .pipe(switchMap((response: any) => {return of(response);}));

  }

  addOrder(model: any): Observable<any> {

    return this._httpClient.post(`${environment.apiUrl}/Canteen/SaveOrder`, model).pipe(
      switchMap((response: any) => {
        return of(response);
      })
    );
  }

  updateOrder(model: any): Observable<any> {

    return this._httpClient.post(`${environment.apiUrl}/Canteen/UpdateOrder`, model).pipe(
      switchMap((response: any) => {
        return of(response);
      })
    );
  }

  deleteOrder(id: any): Observable<any> {
 debugger
    return this._httpClient.post(`${environment.apiUrl}/Canteen/DeleteOrder`, id).pipe(
      switchMap((response: any) => {
        return of(response);
      })
    );
  }

  getOrderItem(): Observable<any> {
    return this._httpClient.get(`${environment.apiUrl}/Canteen/ListOrderItem`, {}).pipe(
      switchMap((response: any) => {
        return of(response);
      })
    );
  }

   getCanteenNotice(): Observable<any> {
    return this._httpClient.get(`${environment.apiUrl}/Canteen/ListNotice`, {}).pipe(
      switchMap((response: any) => {
        return of(response);
      })
    );
  }

  getLoginUserName(rgenId: number): Observable<any> {

    return this._httpClient.get(`${environment.apiLoginUrl}/Student?APIKey=651cb656-1fde-478d-badf-33f60553f36e&studentId=${rgenId}`, {}).pipe(
      switchMap((response: any) => {
        return of(response);
      })
    );
  }

  updateOrderStatus(model: any): Observable<any> {

    return this._httpClient.post(`${environment.apiUrl}/Canteen/UpdateOrderStatus`, model).pipe(
      switchMap((response: any) => {
        return of(response);
      })
    );
  }


  getOrderItemDetails(orderId: any): Observable<any> {

    return this._httpClient.get(`${environment.apiUrl}/Canteen/GetOrderItemDetails/${orderId}`, {}).pipe(
      switchMap((response: any) => {
        return of(response);
      })
    );
  }


  getNotification(): Observable<any> {
    return this._httpClient.get(`${environment.apiUrl}/Canteen/Notifications`, {}).pipe(
      switchMap((response: any) => {
        return of(response);
      })
    );
  }


  signIns(model: any): Observable<any> {
    // Throw error, if the user is already logged in
    //if (this._authenticated) {
    //  return throwError('User is already logged in.');
    //}

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
            usertype: response.account_type_name,
            isAdmin: response.account_type_name.toLocaleLowerCase() === "admin"
          };
          this.secureStore.setItem('user', JSON.stringify(userData));
        }
        return of(response);
      })
    );
  }

  paymentTranstion(model: any): Observable<any> {
    return this._httpClient.post(`${environment.apiUrl}/Canteen/PaymentQRTranstion`, model).pipe(
      switchMap((response: any) => {
        return of(response);
      })
    );
  }

  get refresh$() {
    return this._refresh$.asObservable();
  }

  // Call this when you get a new notification
  notifyRefresh() {
    this._refresh$.next();
  }

   updateNotice(model: any): Observable<any> {
    return this._httpClient.post(`${environment.apiUrl}/Canteen/SaveNotice`, model).pipe(
      switchMap((response: any) => {
        return of(response);
      })
    );
  }


}
