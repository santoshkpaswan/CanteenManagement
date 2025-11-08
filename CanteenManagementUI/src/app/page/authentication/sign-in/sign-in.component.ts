import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth/auth.service';
import { JwksValidationHandler, OAuthService } from 'angular-oauth2-oidc';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { CoreService } from 'src/app/services/core.service';
import { SecureStorageService } from 'src/app/services/secure-storage.service';
// import { CanteenService } from 'src/app/services/canteen/canteen-service';


@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [CommonModule, SharedModule, RouterModule],
  // providers: [AuthService,OAuthService],
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})

export class SignInComponent implements OnInit {
  signInForm!: FormGroup;
  showAlert: boolean = false;
  sendObj!: any;

  constructor(
    // private _canteenService: CanteenService,
    private _authService: AuthService,
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _httpClient: HttpClient,
    private _coreService: CoreService,
    private secureStore: SecureStorageService

  ) {

  }

  ngOnInit(): void {
    this.signInForm = this._formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  signIn(): void {

    if (this.signInForm.invalid) {
      return;
    }
    this.signInForm.disable();

    this.sendObj = {
      username: this.signInForm.value.username,
      password: this.signInForm.value.password
    };

    this._authService.signIn(this.sendObj).subscribe({

      next: (response: any) => {

        this.signInForm.enable();

        if (response.success) {
debugger
          this._coreService.openSnackBar('Login successful!', 'Ok');
          const userData = this.secureStore.getItem<any>("user")!;
          const user: any = JSON.parse(userData);
          if ((!user.isAdmin) && (user.usertype?.toLocaleLowerCase() == "staff" || user.usertype?.toLocaleLowerCase() == "student")) {
            this._router.navigate(['/canteen/order-item']);
          }
          else if (user.isAdmin ){
           //environment.isAdmin =true
            this._router.navigate(['/canteen/admin-order']);
          }
        } else {
          this._coreService.openSnackBar(response.response || 'Login failed', 'Ok');
        }
      },
      error: (error) => {
        this.signInForm.enable();
        this._coreService.openSnackBar(error.message || 'Login failed', 'Ok');
      }
    });

  }
}
