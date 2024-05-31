import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { ResetPasswordRequest } from '../data/DataTypes';

@Component({
  selector: 'app-reset',
  standalone: true,
  imports: [ReactiveFormsModule, MatProgressSpinnerModule, CommonModule],
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.scss']
})
export class ResetComponent {

  resetForm: FormGroup;

  processing: boolean = false;

  resetPasswordDto: ResetPasswordRequest = {
    email: '',
    newPassword: '',
    confirmNewPassword: '',
    confirmationCode: 0
  };

  constructor(private apiService: ApiService) {
    this.resetForm = new FormGroup({
      Email: new FormControl(null, [Validators.required, Validators.email]),
      ConfirmationCode: new FormControl(null, [Validators.required]),
      NewPassword: new FormControl(null, [Validators.required]),
      ConfirmNewPassword: new FormControl(null, [Validators.required])
    }, { validators: this.passwordValidator });
  }

  passwordValidator: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
    const newPassword = group.get('NewPassword')?.value;
    const confirmNewPassword = group.get('ConfirmNewPassword')?.value;

    const passwordErrors: ValidationErrors = {};

    if (newPassword) {
      // Check for required fields
      if (!confirmNewPassword) {
        passwordErrors['confirmPasswordRequired'] = true;
      }

      // Check for strong password
      if (!this.apiService.checkForStrongPassword(newPassword)) {
        passwordErrors['weakPassword'] = true;
      }

      // Check if passwords match
      if (confirmNewPassword && newPassword !== confirmNewPassword) {
        passwordErrors['passwordsMismatch'] = true;
      }
    }
    return Object.keys(passwordErrors).length > 0 ? passwordErrors : null;
  };

  async clickResetPassword() {
    if (this.resetForm.invalid) {
      return;
    }

    this.resetPasswordDto.email = this.resetForm.get('Email')?.value;
    this.resetPasswordDto.confirmationCode = this.resetForm.get('ConfirmationCode')?.value;
    this.resetPasswordDto.newPassword = this.resetForm.get('NewPassword')?.value;
    this.resetPasswordDto.confirmNewPassword = this.resetForm.get('ConfirmNewPassword')?.value;

    try {
      this.apiService.resetPassword(this.resetPasswordDto).subscribe({
        next: (response) => {
          if (response) {
            this.apiService.redirectToLoginPage();
          } else {
            console.error('Reset password failed');
          }
        },
        error: (error: Error) => {
          this.apiService.handleError(error);
        }
      });
    } catch (error) {
      console.error('An error occurred during password reset', error);
    }
  }

  async sendResetCode() {
    if (!this.resetForm.get('Email')?.value) {
      return;
    }
    this.processing = true;
    this.resetPasswordDto.email = this.resetForm.get('Email')?.value;
    try {
      this.apiService.sendResetConfirmationCode({ email: this.resetPasswordDto.email }).subscribe({
        next: () => {
          this.processing = false;
        },
        error: (error: Error) => {
          this.apiService.handleError(error);
        }
      });
    } catch (error) {
      this.processing = false;
      console.error('Failed to send reset code', error);
    }
  }
}
