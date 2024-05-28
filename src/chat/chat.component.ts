import { Component, OnInit } from '@angular/core';
import {MatSidenavModule} from '@angular/material/sidenav'
import {MatDividerModule} from '@angular/material/divider'
import {MatListModule} from '@angular/material/list'
import { CommonModule, NgFor } from '@angular/common';
import {CdkAccordionModule} from '@angular/cdk/accordion';
import {
  FormControl,
  FormGroupDirective,
  NgForm,
  Validators,
  FormsModule,
  ReactiveFormsModule,
  FormGroup
} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import { Router } from '@angular/router';
import { Userr, mockUsers } from '../services/mockData';
import { ApiService} from '../services/api.service';
import { SignalRService } from '../services/signal-r.service';
import { Message, User } from '../data/DataTypes';
import {MatBadgeModule} from '@angular/material/badge';

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
    MatIconModule,
    MatListModule,
    ReactiveFormsModule,
    FormsModule,
    MatBadgeModule
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})

export class ChatComponent implements OnInit {
  currentUser: User = {} as User;
  users: User[] = [];
  user: User = {} as User;
  messages: Message[] = [];

  chatForm: FormGroup = new FormGroup({
    message: new FormControl(),
    searchText: new FormControl()
  });

  constructor(
    private signalRService: SignalRService,
    private router: Router,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.refleshChatPage();
    this.user = this.users[0] ?? {};
    this.signalRService.startConnection();
  }

  sendMessage(): void {
    if (this.chatForm.get('message')?.value.trim() === '') {
      return;
    }
    this.signalRService.sendMessage(this.user.id, this.chatForm.get('message')?.value);
    this.chatForm.get('message')?.setValue('');
    // this.apiService.getUser(this.user.id, null).subscribe({
    //   next: (response)=>{
    //       this.user = response;
    //       this.messages = this.user?.messages;
    //       console.log(this.messages);
    //   },
    //   error:(err:Error)=>{
    //     console.log(err.message);
    //   }
    // });
    this.refleshChatPage();
  }

  refleshChatPage(){
    this.apiService.getCurrentUser().subscribe({
      next: (response)=>{
          this.currentUser = response;
          console.log(`Current User: ${this.currentUser}`);
      },
      error:(err:Error)=>{
        console.log(err.message);
      }
    });

    this.apiService.getUsers('').subscribe({
      next: (response: User[])=>{
        this.users = response;
        console.log(`Users: ${this.users}`);
      },
      error:(err:Error)=>{
        console.log(err.message);
      }
    });

    this.apiService.getUser(this.user.id, null).subscribe({
      next: (response: User)=>{
          this.user = response;
          this.messages = this.user?.messages;
          console.log(`User: ${this.user}`);
          console.log(`Messages: ${this.messages}`);
      },
      error:(err:Error)=>{
        console.log(err.message);
      }
    });
  }

  chooseUser(userId: string): void {
    console.log(userId);
    this.apiService.getUser(userId, null).subscribe({
      next: (response)=>{
          this.user = response;
          this.messages = this.user?.messages;
      },
      error:(err:Error)=>{
        console.log(err.message);
      }
    });
  }

  getUsers(){
    console.log("this");
    if(this.chatForm.get('searchText')?.value){
      this.apiService.getUsers(this.chatForm.get('searchText')?.value).subscribe(
        (response: User[]) => {
          this.users = response
        }
      );
    }
    else{
      console.log("this");
      this.apiService.getUsers('').subscribe(
        (response: User[]) => {
          this.users = response
        }
      );
      // this.apiService.getAllChatUser().subscribe(
      //   (response: User[]) => {
      //     this.users = response;
      //   }
      // );
    }
  }

  handleKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.keyCode == 13) {
      this.sendMessage();
    }
  }

    logOut(){
    this.router.navigate(['/login']);
    localStorage.removeItem('accessToken');
    this.signalRService.stopConnection();
  }

}
