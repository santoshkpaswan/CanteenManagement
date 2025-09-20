import { AuthService } from 'src/app/services/auth/auth.service';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { CoreService } from 'src/app/services/core.service';
import { ConfirmationDialogService } from 'src/app/confirmation-dialog/confirmation-dialog.service';
import { OAuthService } from 'angular-oauth2-oidc';
import { CommonModule, SlicePipe} from '@angular/common'
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MatIconModule,RouterModule,SlicePipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit{

  constructor(private _coreService: CoreService,
    private _formBuilder: FormBuilder,
    private _authService: AuthService,
    private _httpClient: HttpClient,
    private confirmationDialogService: ConfirmationDialogService,
  ) { }

  ngOnInit(): void {
  }
  
}
