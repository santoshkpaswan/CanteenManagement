import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class AccessConfigService {
    isLoggedIn = new BehaviorSubject<boolean>(false);
    constructor(private _httpClient: HttpClient) {
    }

    validateUserDetails(data:any): Observable<any> {
        return this._httpClient.post(`${environment.apiUrl}/SystemAccessConfigure/ValidateUserDetails`, data).pipe(
            switchMap((response: any) => {
                return of(response);
            })
        );
    }

    validateSystemDetails(data:any): Observable<any> {
        return this._httpClient.post(`${environment.apiUrl}/SystemAccessConfigure/ValidateSystemDetails`, data).pipe(
            switchMap((response: any) => {
                return of(response);
            })
        );
    }

    validateSystemRoles(data:any): Observable<any> {
        return this._httpClient.post(`${environment.apiUrl}/SystemAccessConfigure/ValidateSystemRoles`, data).pipe(
            switchMap((response: any) => {
                return of(response);
            })
        );
    }

    validateEnvironmentDetails(data:any): Observable<any> {
        return this._httpClient.post(`${environment.apiUrl}/SystemAccessConfigure/ValidateEnvironmentDetails`, data).pipe(
            switchMap((response: any) => {
                return of(response);
            })
        );
    }

    validateProjectDetails(data:any): Observable<any> {
        return this._httpClient.post(`${environment.apiUrl}/SystemAccessConfigure/ValidateProjectDetails`, data).pipe(
            switchMap((response: any) => {
                return of(response);
            })
        );
    }

    validateAccessDetails(data:any): Observable<any> {
        return this._httpClient.post(`${environment.apiUrl}/SystemAccessConfigure/ValidateAccessDetails`, data).pipe(
            switchMap((response: any) => {
                return of(response);
            })
        );
    }

    systemConfigureSummaryDetails(data:any): Observable<any> {
        return this._httpClient.post(`${environment.apiUrl}/SystemAccessConfigure/SystemConfigureSummaryDetails`, data).pipe(
            switchMap((response: any) => {
                return of(response);
            })
        );
    }

    saveBatchFileDetails(pagerightdetails:any): Observable<any> {
        return this._httpClient.post(`${environment.apiUrl}/SystemAccessConfigure/SaveBatchFileDetails`, pagerightdetails).pipe(
            switchMap((response: any) => {
                return of(response);
            })
        );
    }
}
