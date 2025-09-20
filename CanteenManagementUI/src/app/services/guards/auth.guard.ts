import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, CanLoad, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';
import { switchMap } from 'rxjs/operators';
import { NavigationItem, NavigationItems } from 'src/app/theme/layout/admin/navigation/navigation';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild, CanLoad
{
    navigations: NavigationItem[];
    isUrlCorrect:boolean=false;
    existingUrls:string ="";
    constructor(
        private _authService: AuthService,
        private _router: Router
    )
    {
        this.navigations = NavigationItems;
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Can activate
     *
     * @param route
     * @param state
     */
    canActivate(route: ActivatedRouteSnapshot,
                state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        const redirectUrl = state.url === '/sign-out' ? '/' : state.url;
        // if(state.url === '/no-access'){
        //     this._router.navigate(['/not-found']);
        //     return false;
        //    }

       // fetch the page-rights stored in local storage that are saved from the page-rights service
        // if (localStorage.getItem("page_rights")){
        //         const hasAccess = this.hasPageRights(state);
        //         if(!hasAccess){
        //             this._router.navigate(['/no-access']);
        //             return false;
        //         }
        // }
       
        return this.check(redirectUrl);
    }

    /**
     * Can activate child
     *
     * @param childRoute
     * @param state
     */
    canActivateChild(childRoute: ActivatedRouteSnapshot,
                     state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        
        const redirectUrl = state.url === '/sign-out' ? '/' : state.url;
        return this.check(redirectUrl);
    }

    /**
     * Can load
     *
     * @param route
     * @param segments
     */
    canLoad(route: Route, segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean
    {
        return this.check('/');
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Check the authenticated status
     *
     * @param redirectURL
     * @private
     */
    private check(redirectURL: string): Observable<boolean> {
        // Check the authentication status
        return this._authService.check()
                                .pipe(switchMap((authenticated) => {
                           // If the user is not authenticated...
                        //    if ( !authenticated ){
                        //        // Redirect to the sign-in page
                        //        this._router.navigate(['signin']);

                        //        // Prevent the access
                        //        return of(false);
                        //    }

                           // Allow the access
                           return of(true);
                       })
                   );
    }

    private hasPageRights(route: RouterStateSnapshot): boolean {
       return true;
    }
    
}
