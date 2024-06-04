import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CommonModule } from '@angular/common';
import { RegisterRequest, SendConfirmationCodeRequest } from '../data/DataTypes';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, MatProgressSpinnerModule, MatProgressBarModule, CommonModule,MatFormFieldModule, MatInputModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

  registerForm: FormGroup;

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
  };

  constructor(private apiService: ApiService) {
    this.registerForm = new FormGroup({
      FirstName: new FormControl(null, [Validators.required]),
      LastName: new FormControl(null, [Validators.required]),
      Email: new FormControl(null, [Validators.required, Validators.email]),
      ConfirmCode: new FormControl(null, [Validators.required]),
      Password: new FormControl(null, [Validators.required]),
      ConfirmPassword: new FormControl(null, [Validators.required]),
      Photo: new FormControl<File | null>(null),
    }, { validators: this.passwordValidator });
  }

  passwordValidator: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
    const password = group.get('Password')?.value;
    const confirmPassword = group.get('ConfirmPassword')?.value;

    const passwordErrors: ValidationErrors = {};

    if (password && confirmPassword) {
      if (!this.apiService.checkForStrongPassword(password)) {
        passwordErrors['weakPassword'] = true;
      }

      if (confirmPassword && password != confirmPassword) {
        passwordErrors['passwordsMismatch'] = true;
      }
    }

    return Object.keys(passwordErrors).length > 0 ? passwordErrors : null;
  };

  async clickRegister() {
    console.log("clicked");
    if (this.registerForm.invalid) {
      return;
    }

    this.registerDto.Email = this.registerForm.get('Email')?.value;
    this.registerDto.ConfirmCode = this.registerForm.get('ConfirmCode')?.value;
    this.registerDto.FirstName = this.registerForm.get('FirstName')?.value;
    this.registerDto.LastName = this.registerForm.get('LastName')?.value;
    this.registerDto.Password = this.registerForm.get('Password')?.value;
    this.registerDto.ConfirmPassword = this.registerForm.get('ConfirmPassword')?.value;
    if (this.registerForm.get('Photo')?.value) {
      this.registerDto.Photo = this.registerForm.get('Photo')?.value;
    }

    try {
      this.apiService.register(this.registerDto).subscribe({
        next: () => {
          this.apiService.redirectToLoginPage();
        },
        error: (error: Error) => {
          this.apiService.handleError(error);
        }
      });
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
    try {
      this.apiService.sendConfirmationCode(this.sendConfirmCodeDto).subscribe({
        next: () => {
          this.processing = false;
        },
        error: (error: Error) => {
          this.processing = false;
          this.apiService.handleError(error);
        }
      });
    } catch (error) {
      this.processing = false;
      console.error('Error:', error);
    }
  }

  onFileSelected(event: any) {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      this.registerForm.get('Photo')?.setValue(selectedFile);
    }
  }
}
