import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NavigationItem, NavigationItems } from '../navigation';
import { Location, LocationStrategy } from '@angular/common';
import { environment } from 'src/environments/environment';
import { Router, RouterModule } from '@angular/router';
import { SecureStorageService } from 'src/app/services/secure-storage.service';

@Component({
  selector: 'app-nav-content',
  templateUrl: './nav-content.component.html',
  styleUrls: ['./nav-content.component.scss']
})
export class NavContentComponent implements OnInit {
  // version
  title = 'CANTEEN MANAGEMENT';
  currentApplicationVersion = environment.appVersion;

  // public pops
  navigations: NavigationItem[];
  tempnavigations: NavigationItem[] = [];
  wrapperWidth!: number;
  windowWidth: number;

  @Output() NavMobCollapse = new EventEmitter();
  constructor(
    private location: Location,
    private _router: Router,
    private locationStrategy: LocationStrategy,
    private secureStore: SecureStorageService
  ) {
    this.windowWidth = window.innerWidth;

    this.navigations = JSON.parse(JSON.stringify(NavigationItems));
  }

  // life cycle event
  ngOnInit() {
    var navigationList = this.navigations;
    var indicesToRemove: number[];
    const userData = this.secureStore.getItem<any>("user")!;
    debugger
    if (userData != null) {
      const user: any = JSON.parse(userData);
      if ((!user.isAdmin) && (user.usertype?.toLocaleLowerCase() == "staff" || user.usertype?.toLocaleLowerCase() == "student")) {
        navigationList = navigationList.filter(u => u.id !== "navigation1");

        navigationList[0].children = navigationList[0].children?.filter(x => x.id == "orderitem" || x.id == "orderhistory");
      }
      else if (user.isAdmin) {
        //navigationList = navigationList.filter(u => u.id !== "navigation1");

        navigationList[0].children = navigationList[0].children?.filter(x => x.id != "orderhistory");
        navigationList[0].children = navigationList[0].children?.filter(x => x.id != "orderitem");
      }

    }
    else {
      this._router.navigate(['/signin']);
    }

    this.navigations = navigationList;

    if (this.windowWidth < 992) {
      document.querySelector('.pcoded-navbar')?.classList.add('menupos-static');
    }
  }

  // public method

  navMob() {
    if (this.windowWidth < 992 && document.querySelector('app-navigation.pcoded-navbar')?.classList.contains('mob-open')) {
      this.NavMobCollapse.emit();
    }
  }

  fireOutClick() {
    let current_url = this.location.path();
    const baseHref = this.locationStrategy.getBaseHref();
    if (baseHref) {
      current_url = baseHref + this.location.path();
    }
    const link = "a.nav-link[ href='" + current_url + "' ]";
    const ele = document.querySelector(link);
    if (ele !== null && ele !== undefined) {
      const parent = ele.parentElement;
      const up_parent = parent?.parentElement?.parentElement;
      const last_parent = up_parent?.parentElement;
      if (parent?.classList.contains('pcoded-hasmenu')) {
        parent.classList.add('pcoded-trigger');
        parent.classList.add('active');
      } else if (up_parent?.classList.contains('pcoded-hasmenu')) {
        up_parent.classList.add('pcoded-trigger');
        up_parent.classList.add('active');
      } else if (last_parent?.classList.contains('pcoded-hasmenu')) {
        last_parent.classList.add('pcoded-trigger');
        last_parent.classList.add('active');
      }
    }
  }
}
