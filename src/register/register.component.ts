import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CommonModule } from '@angular/common';
import {
   RegisterRequest,
   SendConfirmationCodeRequest
  } from '../data/DataTypes';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, MatProgressSpinnerModule, MatProgressBarModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

  constructor(private apiService: ApiService) { }

  registerForm: FormGroup = new FormGroup({
    FirstName: new FormControl(null, {
      validators: [Validators.required]
    }),
    LastName: new FormControl(null, {
      validators: [Validators.required]
    }),
    Email: new FormControl(null, {
      validators: [Validators.required, Validators.email]
    }),
    ConfirmCode: new FormControl(null, {
      validators: [Validators.required]
    }),
    Password: new FormControl(null, {
      validators: [Validators.required]
    }),
    ConfirmPassword: new FormControl(null, {
      validators: [Validators.required]
    }),
    Photo: new FormControl<File | null>(null)
  });

  registerDto: RegisterRequest = {
    FirstName: '',
    LastName: '',
    Email: '',
    ConfirmCode: '',
    Password: '',
    ConfirmPassword: '',
    Photo: null
  };

  processing: boolean = false;

  sendConfirmCodeDto: SendConfirmationCodeRequest = {
    email: ''
  }

  async clickRegister() {
    if (this.registerForm.invalid) {
      return;
    }

    this.registerDto.Email = this.registerForm.get('Email')?.value;
    this.registerDto.ConfirmCode = this.registerForm.get('ConfirmCode')?.value;
    this.registerDto.FirstName = this.registerForm.get('FirstName')?.value;
    this.registerDto.LastName = this.registerForm.get('LastName')?.value;
    this.registerDto.Password = this.registerForm.get('Password')?.value;
    this.registerDto.ConfirmPassword = this.registerForm.get('ConfirmPassword')?.value;
    if (this.registerForm.get("Photo")?.value) {
      this.registerDto.Photo = this.registerForm.get("Photo")?.value;
    }

    try {
      const response = await this.apiService.register(this.registerDto);
      console.log('Response:', response);
      this.apiService.redirectToLoginPage();
    } catch (error) {
      console.error('Error:', error);
    }
  }


  async sendConfirmCode() {
    if (!this.registerForm.get('Email')?.value) {
      return;
    }
    this.processing = true;
    this.sendConfirmCodeDto.email = this.registerForm.get('Email')?.value;
    console.log(this.sendConfirmCodeDto);
    try {
      const response = await this.apiService.sendConfirmationCode(this.sendConfirmCodeDto);
      console.log('Response:', response);
      this.processing = false;
    } catch (error) {
      this.processing = false;
      console.error("Error", error);
    }
  }

  onFileSelected(event: any) {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      this.registerForm.get('Photo')?.setValue(selectedFile);
    }
  }

}
