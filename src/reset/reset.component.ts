import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService, ResetPasswordDto } from '../services/api.service';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reset',
  standalone: true,
  imports: [ReactiveFormsModule, MatProgressSpinnerModule, CommonModule],
  templateUrl: './reset.component.html',
  styleUrl: './reset.component.scss'
})
export class ResetComponent {

  resetForm: FormGroup = new FormGroup({
    Email: new FormControl(null, {
      validators: [Validators.required, Validators.email]
    }),
    ConfirmationCode: new FormControl(null, {
      validators: [Validators.required]
    }),
    NewPassword: new FormControl(null, {
      validators: [Validators.required]
    }),
    ConfirmNewPassword: new FormControl(null, {
      validators: [Validators.required]
    }),
  });

  proccessing: boolean = false;

  resetPasswordDto: ResetPasswordDto ={
    Email: '',
    ConfirmationCode: '',
    NewPassword: '',
    ConfirmNewPassword: ''
  };

  constructor(
    private apiService: ApiService
  ){}

  async clickResetPassword() {
    if (this.resetForm.invalid) {
      return;
    }

    this.resetPasswordDto.ConfirmationCode = this.resetForm.get('ConfirmationCode')?.value;
    this.resetPasswordDto.NewPassword = this.resetForm.get('NewPassword')?.value;
    this.resetPasswordDto.ConfirmNewPassword = this.resetForm.get('ConfirmNewPassword')?.value;

    try {
      const response = await this.apiService.resetPassword(this.resetPasswordDto).toPromise();
      if (response) {
        this.apiService.redirectToLoginPage();
      } else {
        console.error('Reset password failed', response.message);
      }
    } catch (error) {
      console.error('An error occurred during password reset', error);
    }
  }

  sendResetCode() {
    if(!this.resetForm.get('Email')?.value){
      return;
    }
    this.proccessing = true;
    this.resetPasswordDto.Email = this.resetForm.get('Email')?.value;
    if (this.resetPasswordDto.Email) {
      this.apiService.sendResetConfirmationCode({ email: this.resetPasswordDto.Email }).subscribe(
        () =>{
          this.proccessing = false;
          console.log('Reset code sent')
        },
        (error) => {
          this.proccessing = false;
          console.error('Failed to send reset code', error);
        }
      );
    }
  }
}
