import { Component } from '@angular/core';
import { ChangePasswordRequest, UpdateUserRequest, User } from '../data/DataTypes';
import { FormControl, FormGroup, Validators, FormsModule, ReactiveFormsModule, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import {
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
  MatDialogModule,
  MatDialog,
} from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { ApiService } from '../services/api.service';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-user-settings-dialog',
  standalone: true,
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatDialogModule,
    CommonModule,
    MatIconModule
  ],
  templateUrl: './user-settings-dialog.component.html',
  styleUrls: ['./user-settings-dialog.component.scss'],
})
export class UserSettingsDialogComponent {
  updateUserRequest: UpdateUserRequest = {
    id: '',
    firstName: null,
    lastName: null,
    photo: null,
  };

  changePasswordRequest: ChangePasswordRequest = {
    email: '',
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  };

  updateUserForm: FormGroup;
  changingPassword: boolean = false;
  currentUser: User = {} as User;
  storageApi: string = "http://localhost:5038/api/Storage";

  constructor(
    private apiService: ApiService,
    private dialog: MatDialog
  ) {
    this.updateUserForm = new FormGroup({
      firstName: new FormControl(null),
      lastName: new FormControl(null),
      oldPassword: new FormControl(null),
      newPassword: new FormControl(null),
      confirmPassword: new FormControl(null),
      photo: new FormControl(null),
    }, { validators: this.passwordValidator });

    this.apiService.getCurrentUser().subscribe({
      next: (response: User) => {
        this.currentUser = response;
        this.updateUserForm.get('firstName')?.setValue(this.currentUser.firstName);
        this.updateUserForm.get('lastName')?.setValue(this.currentUser.lastName);
      },
      error: (error: Error) => {
        this.apiService.handleError(error);
      },
    });

    this.updateUserForm.get('newPassword')?.valueChanges.subscribe({
      next: (password: string) => {
        this.updateUserForm.updateValueAndValidity();
        if (password) {
          this.changingPassword = true;
          this.updateUserForm.get('confirmPassword')?.setValidators([Validators.required]);
          this.updateUserForm.get('oldPassword')?.setValidators([Validators.required]);
        } else {
          this.changingPassword = false;
          this.updateUserForm.get('confirmPassword')?.clearValidators();
          this.updateUserForm.get('oldPassword')?.clearValidators();
        }
        this.updateUserForm.get('confirmPassword')?.updateValueAndValidity();
        this.updateUserForm.get('oldPassword')?.updateValueAndValidity();
      },
      error: (error: Error) => {
        this.apiService.handleError(error);
      },
    });
  }

  passwordValidator: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
    const newPassword = group.get('newPassword')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    const oldPassword = group.get('oldPassword')?.value;

    const passwordErrors: ValidationErrors = {};

    if (newPassword) {
      if (!confirmPassword) {
        passwordErrors['confirmPasswordRequired'] = true;
      }
      if (!oldPassword) {
        passwordErrors['oldPasswordRequired'] = true;
      }

      if(!this.apiService.checkForStrongPassword(newPassword)){
        passwordErrors['weakPassword'] = true;
      }

      if (confirmPassword && newPassword !== confirmPassword) {
        passwordErrors['passwordsMismatch'] = true;
      }
    }
    return Object.keys(passwordErrors).length > 0 ? passwordErrors : null;
  };

  onClickCancel() {
    this.dialog.closeAll();
  }

  onClickSave() {
    if (this.updateUserForm.valid) {
      this.updateUserRequest.id = this.currentUser.id;
      this.updateUserRequest.firstName = this.updateUserForm.get("firstName")?.value;
      this.updateUserRequest.lastName = this.updateUserForm.get("lastName")?.value;
      this.updateUserRequest.photo = this.updateUserForm.get("photo")?.value;
      this.apiService.editUser(this.updateUserRequest).subscribe({
        next: () => {
          this.dialog.closeAll();
        },
        error: (error: Error) => {
          this.apiService.handleError(error);
        }
      })
    }
  }

  onClickDeleteAccount() {
    if(confirm("Are you sure about delete your account?\nYou can't reverce this procces!")){
      console.log("YESSSSSSSS");
      this.apiService.deleteUser(this.currentUser.id).subscribe({
        next: () => {
          this.dialog.closeAll();
          this.apiService.redirectToLoginPage();
        },
        error: (error: Error) => {
          this.apiService.handleError(error);
        }
      });
    }
    else{
      this.dialog.closeAll();
    }
  }

  getImageUrl() : string {
    return this.currentUser.photoName ? `${this.storageApi}/${this.currentUser.photoName}` : '../assets/icons/user-avatar.png';
  }

  onFileSelected(event: any) {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      this.updateUserForm.get('photo')?.setValue(selectedFile);
    }
  }
}
