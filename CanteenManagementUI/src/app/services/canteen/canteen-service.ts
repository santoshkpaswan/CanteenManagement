import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, switchMap } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CanteenService {

  constructor(private _httpClient: HttpClient) { }

  getFoodDays(): Observable<any> {
    debugger
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
    debugger
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
    debugger
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
    debugger
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
    debugger
    return this._httpClient.post(`${environment.apiUrl}/Canteen/DeleteFoodMenuItemPrice/${id}`, {}).pipe(
      switchMap((response: any) => {
        return of(response);
      })
    );
  }
  getDayWiseFoodItem(): Observable<any> {
    debugger
    return this._httpClient.get(`${environment.apiUrl}/Canteen/ListDayWiseFoodMenuItem`, {}).pipe(
      switchMap((response: any) => {
        return of(response);
      })
    );
  }

  addDayWiseFoodItem(model: any): Observable<any> {
    debugger
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
    debugger
    return this._httpClient.post(`${environment.apiUrl}/Canteen/DeleteDayWiseFoodMenuItem/${id}`, {}).pipe(
      switchMap((response: any) => {
        return of(response);
      })
    );
  }

  getOrder(): Observable<any> {
    debugger
    return this._httpClient.get(`${environment.apiUrl}/Canteen/ListOrder`, {}).pipe(
      switchMap((response: any) => {
        return of(response);
      })
    );
  }
  addOrder(model: any): Observable<any> {
    debugger
    return this._httpClient.post(`${environment.apiUrl}/Canteen/SaveOrder`, model).pipe(
      switchMap((response: any) => {
        return of(response);
      })
    );
  }

  updateOrder(model: any): Observable<any> {
    debugger
    return this._httpClient.post(`${environment.apiUrl}/Canteen/UpdateOrder`, model).pipe(
      switchMap((response: any) => {
        return of(response);
      })
    );
  }

  deleteOrder(id: any): Observable<any> {
    debugger
    return this._httpClient.post(`${environment.apiUrl}/Canteen/DeleteOrder/${id}`, {}).pipe(
      switchMap((response: any) => {
        return of(response);
      })
    );
  }

  getOrderItem(): Observable<any> {
    debugger
    return this._httpClient.get(`${environment.apiUrl}/Canteen/ListOrderItem`, {}).pipe(
      switchMap((response: any) => {
        return of(response);
      })
    );
  }

  getLoginUserName(rgenId: number): Observable<any> {
    debugger
    return this._httpClient.get(`${environment.apiLoginUrl}/Student?APIKey=651cb656-1fde-478d-badf-33f60553f36e&studentId=${rgenId}`, {}).pipe(
      switchMap((response: any) => {
        return of(response);
      })
    );
  }

  updateOrderStatus(model: any): Observable<any> {
    debugger
    return this._httpClient.post(`${environment.apiUrl}/Canteen/UpdateOrderStatus`, model).pipe(
      switchMap((response: any) => {
        return of(response);
      })
    );
  }


  getOrderItemDetails(orderId: any): Observable<any> {
      debugger
      return this._httpClient.get(`${environment.apiUrl}/Canteen/GetOrderItemDetails/${orderId}`, {}).pipe(
          switchMap((response: any) => {
              return of(response);
          })
      );
  }


}
