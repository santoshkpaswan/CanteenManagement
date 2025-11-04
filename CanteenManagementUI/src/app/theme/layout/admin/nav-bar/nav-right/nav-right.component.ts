// Angular Import
import { Component, DoCheck } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { GradientConfig } from 'src/app/app-config';
import { AuthService } from 'src/app/services/auth/auth.service';
import { JwksValidationHandler, OAuthService } from 'angular-oauth2-oidc';
import { HttpClient } from '@angular/common/http';
import { CanteenService } from 'src/app/services/canteen/canteen-service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
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
  emailid: any;
  Name: string = '';
  userName: string = '';
  showNotification: boolean = false;
  notificationCount: number = 0;
  previousNotificationCount: number = 0;

  currentPage: any = 0;
  pageSize: any = 10;
  orderList: any = [];
  dayName: any = [];
  selectedOrder: any;
  statusFilter: string = '';
  orderDateFilter: string = '';
  selectedOrderDetails: any[] = [];
  gradientConfig = GradientConfig;
  dataSource = new MatTableDataSource<any>();


  private audio = new Audio('assets/notification/mixkit-clear-announce-tones-2861.wav');
  // constructor
  constructor(
    private oauthService: OAuthService,
    private _httpClient: HttpClient,
    private _activatedRoute: ActivatedRoute,
    private router: Router,
    private _authService: AuthService,
    private _canteenService: CanteenService,

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

  ngOnInit(): void {
    debugger
    const userData = localStorage.getItem("user");
    if (userData) {
      const user: any = JSON.parse(userData);
      const userName = user.user_name?.toLowerCase(); // normalize case
      this.userName = userName;
      //this.showNotification = userName === 'canteen'; // only for canteen
      if (this.userName) {
        this.getNotificationData();

        // Poll notifications every 10 seconds
        setInterval(() => this.getNotificationData(), 15000);
      }
    }
    this.getGridData();
    this.getLoginUserNameGridData();
  }

  getGridData() {
    this._canteenService.getOrder().subscribe((response) => {

      //this.dataSource = response.data;
      this.orderList = response.data;
      this.dataSource = new MatTableDataSource<any>(response.data);


      // Set filter predicate once
      function parseDDMMYYYY(dateStr: string): Date {
        const [day, month, year] = dateStr.split('-').map(Number);
        return new Date(year, month - 1, day);
      }
      this.dataSource.filterPredicate = (data: any, filter: string) => {
        const filters = JSON.parse(filter);
        const statusMatch = filters.status ? data.status === +filters.status : true;
        const dateMatch = filters.orderDate ? parseDDMMYYYY(data.orderDate).toDateString() === new Date(filters.orderDate).toDateString() : true;
        return statusMatch && dateMatch;
      };
    });
  }

  getNotificationData() {
    this._canteenService.getNotification().subscribe({
      next: (response) => {
        let newCount = 0;
        if (response && Array.isArray(response.data)) {
          newCount = response.data.length;
          //this.notificationCount = response.data.length;
        }
        else if (response?.count) {
          //this.notificationCount = response.count;
          newCount = response.count;
        }
        // Play sound & show toast if new notification
        if (this.userName?.trim().toLowerCase() === 'admin') {
          if (this.previousNotificationCount !== null && newCount > this.previousNotificationCount) {
            this.playNotificationSound();
            this.showToast('🔔 New Order!');
            //this.refreshTableGrid();
            this.getGridData();
          }
        }
        this.previousNotificationCount = newCount;
        this.notificationCount = newCount;
      },
    });
  }

  // Play notification sound
  playNotificationSound() {
    this.audio.currentTime = 0;
    this.audio.play().catch(err => console.warn('Audio play blocked or failed:', err));
  }

   refreshTableGrid() {
     this.getGridData(); // reload Angular table
     setTimeout(() => {window.location.reload();}, 1500); // full page reload after short delay
   }

  // Simple toast popup (vanilla JS)
  showToast(message: string) {
    const toast = document.createElement('div');
    toast.innerText = message;
    toast.style.position = 'fixed';
    toast.style.top = '20px';
    toast.style.right = '20px';
    toast.style.padding = '10px 20px';
    toast.style.background = '#28a745';
    toast.style.color = '#fff';
    toast.style.borderRadius = '5px';
    toast.style.boxShadow = '0px 2px 10px rgba(0,0,0,0.3)';
    toast.style.zIndex = '9999';
    toast.style.transition = 'opacity 0.5s';
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => document.body.removeChild(toast), 500);
    }, 3000);
  }

  // fetch name from backend
  getLoginUserNameGridData() {
    debugger
    const currentUser = this._authService.getUser();
    const rgenId = currentUser.account_id;

    this._canteenService.getLoginUserName(rgenId).subscribe({
      next: (response) => {
        this.Name = response.Name;
      },
      error: (err) => {
        console.error('Error fetching name:', err);
      }
    });
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
