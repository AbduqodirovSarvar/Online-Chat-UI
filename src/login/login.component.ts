import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { LoginRequest, LoginResponse } from '../data/DataTypes';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, MatProgressSpinnerModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  loginDto: LoginRequest = {
    email: '',
    password: ''
  };

  proccessing: boolean = false;

  constructor(
    private router: Router,
    private apiService: ApiService
  ) {}

  loginForm: FormGroup = new FormGroup({
    Email: new FormControl(null, {
      validators: [Validators.required, Validators.email]
    }),
    Password: new FormControl(null, {
      validators: [Validators.required]
    })
  });

  redirectToRegister(){
    this.router.navigate(['/register']);
  }

  redirectToReset(){
    this.router.navigate(['/forgot-password']);
  }

  async clickSubmit() {
    if (this.loginForm.invalid) {
      return;
    }
    this.proccessing = true;

    this.loginDto.email = this.loginForm.get('Email')?.value;
    this.loginDto.password = this.loginForm.get('Password')?.value;

    try {
      this.apiService.login(this.loginDto).subscribe({
        next: (response: LoginResponse) => {
          if(response.accessToken){
            this.apiService.saveAccessToken(response.accessToken);
            this.proccessing = false;
            this.router.navigate(['/chat']);
          }else{
            this.proccessing = false;
            throw new Error("Login error");
          }
        },
        error: (error: Error) => {
          this.apiService.handleError(error);
        }
      });
    } catch (error) {
      console.error('An error occurred during login', error);
    }
  }
}
