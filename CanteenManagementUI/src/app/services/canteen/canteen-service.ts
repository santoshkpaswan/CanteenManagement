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

}
