import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { ResetPasswordRequest } from '../data/DataTypes';

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

  resetPasswordDto: ResetPasswordRequest ={
    email: '',
    newPassword: '',
    confirmNewPassword: '',
    confirmationCode: 0
  };

  constructor(
    private apiService: ApiService
  ){}

  async clickResetPassword() {
    if (this.resetForm.invalid) {
      return;
    }

    this.resetPasswordDto.confirmationCode = this.resetForm.get('ConfirmationCode')?.value;
    this.resetPasswordDto.newPassword = this.resetForm.get('NewPassword')?.value;
    this.resetPasswordDto.confirmNewPassword = this.resetForm.get('ConfirmNewPassword')?.value;

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
    this.resetPasswordDto.email = this.resetForm.get('Email')?.value;
    if (this.resetPasswordDto.email) {
      this.apiService.sendResetConfirmationCode({ email: this.resetPasswordDto.email }).subscribe(
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
