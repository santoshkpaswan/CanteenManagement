// Angular Import
import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  // constructor
  constructor(private router: Router) {}

  // life cycle event
  ngOnInit() {
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0);
    });

    window.addEventListener('beforeunload', this.clearLocalStorageOnUnload.bind(this));
  }

  clearLocalStorageOnUnload(event: Event): void {
    // Clear local storage when the window is about to be unloaded
    localStorage.removeItem('page_rights');
  }
}


