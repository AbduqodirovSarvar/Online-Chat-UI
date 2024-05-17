import { Component } from '@angular/core';
import {MatSidenavModule} from '@angular/material/sidenav'
import {MatDividerModule} from '@angular/material/divider'
import {MatListModule} from '@angular/material/list'
import { CommonModule } from '@angular/common';
import {CdkAccordionModule} from '@angular/cdk/accordion';
import {
  FormControl,
  FormGroupDirective,
  NgForm,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    MatSidenavModule,
    MatDividerModule,
    MatListModule,
    CommonModule,
    CdkAccordionModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatIconModule
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})

export class ChatComponent {

  clickChat(){
    alert('Clicked');
  }

  accounts = [
    { name: 'Account 1', messages: [{ sender: 'Account 1', text: 'Hello!' }] },
    { name: 'Account 2', messages: [{ sender: 'Account 2', text: 'Hi!' }] },
    { name: 'Account 3', messages: [{ sender: 'Account 3', text: 'Hey!' }] }
  ];

  selectedAccount = this.accounts[0];

  selectAccount(account: any) {
    this.selectedAccount = account;
  }

  sendMessage(){

  }
}
