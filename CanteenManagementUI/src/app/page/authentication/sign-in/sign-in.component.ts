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
    private _authService: AuthService,
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _httpClient: HttpClient,
    private _coreService: CoreService,

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
      user_name: this.signInForm.value.username,
      password: this.signInForm.value.password
    };
    // this._router.navigate(['/user/home']);
    //   this._authService.signIn(this.sendObj)
    //     .subscribe(
    //       (response: any) => {
    //
    //         this._router.navigate(['home']);
    //       },
    //       (error) => {
    //         this.signInForm.enable();
    //         this._coreService.openSnackBar(error.message, 'Ok');
    //       });


    this._authService.signIn(this.sendObj).subscribe({
      next: (response: any) => {

        this.signInForm.enable();

        if (response.response_id == 1) {
          debugger
          this._coreService.openSnackBar('Login successful!', 'Ok');
          const userData = localStorage.getItem("user")!;
          const user: any = JSON.parse(userData);
          if ((user.user_name?.toLocaleLowerCase() != "canteen" ) && (user.usertype?.toLocaleLowerCase() == "staff" || user.usertype?.toLocaleLowerCase() == "student")) {
            this._router.navigate(['/canteen/order-item']);
          }
          else if (user.user_name?.toLocaleLowerCase() == "canteen" ){
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
