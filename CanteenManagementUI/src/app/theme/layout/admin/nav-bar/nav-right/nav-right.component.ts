// Angular Import
import { Component, DoCheck } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { GradientConfig } from 'src/app/app-config';
import { AuthService } from 'src/app/services/auth/auth.service';
import { JwksValidationHandler, OAuthService } from 'angular-oauth2-oidc';
import { HttpClient } from '@angular/common/http';

// bootstrap
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-nav-right',
  templateUrl: './nav-right.component.html',
  styleUrls: ['./nav-right.component.scss'],
  providers: [NgbDropdownConfig],
  animations: [
    trigger('slideInOutLeft', [
      transition(':enter', [style({ transform: 'translateX(100%)' }), animate('300ms ease-in', style({ transform: 'translateX(0%)' }))]),
      transition(':leave', [animate('300ms ease-in', style({ transform: 'translateX(100%)' }))])
    ]),
    trigger('slideInOutRight', [
      transition(':enter', [style({ transform: 'translateX(-100%)' }), animate('300ms ease-in', style({ transform: 'translateX(0%)' }))]),
      transition(':leave', [animate('300ms ease-in', style({ transform: 'translateX(-100%)' }))])
    ])
  ]
})
export class NavRightComponent {
  // public props
  visibleUserList: boolean;
  chatMessage: boolean;
  friendId!: number;
  emailid:any;
  gradientConfig = GradientConfig;

  // constructor
  constructor(
    private oauthService: OAuthService,
    private _httpClient: HttpClient,
    private _activatedRoute: ActivatedRoute,
    private router: Router,
    private _authService: AuthService
  ) {
    this.visibleUserList = false;
    this.chatMessage = false;
    this.emailid = localStorage.getItem("emailid");
  }

  // public method
  onChatToggle(friendID: number) {
    this.friendId = friendID;
    this.chatMessage = !this.chatMessage;
  }

  ngDoCheck() {
    if (document.querySelector('body')?.classList.contains('elite-rtl')) {
      this.gradientConfig.isRtlLayout = true;
    } else {
      this.gradientConfig.isRtlLayout = false;
    }
  }

  OnLogout() {
    
    this._authService.removeToken();
    this.oauthService.logOut(true);
    this.router.navigate(['/signin']);
  }
}
