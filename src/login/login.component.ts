import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { LoginRequest } from '../data/DataTypes';

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
      const response = await this.apiService.login(this.loginDto).toPromise();
      if (response && response.accessToken) {
        this.proccessing = false;
        this.router.navigate(['/chat']);
      } else {
        console.error('Login failed', response.message);
        this.proccessing = false;
      }
    } catch (error) {
      console.error('An error occurred during login', error);
    }
  }
}
