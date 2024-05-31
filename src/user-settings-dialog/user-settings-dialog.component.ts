import { Component } from '@angular/core';
import { UpdateUserRequest } from '../data/DataTypes';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-user-settings-dialog',
  standalone: true,
  imports: [],
  templateUrl: './user-settings-dialog.component.html',
  styleUrl: './user-settings-dialog.component.scss'
})
export class UserSettingsDialogComponent {

  updateUserRequest: UpdateUserRequest = {
    id: '',
    firstName: null,
    lastName: null,
    photo: null
  };

  updateUserForm: FormGroup =  new FormGroup({
    firstName: new FormControl(null),
    lastName: new FormControl(null),
    photo: new FormControl(File || null)
  });

  clickCancel(){

  }

  clickSave(){

  }

  clickDeleteAccount(){

  }
}
