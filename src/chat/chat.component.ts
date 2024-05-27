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
  FormGroup,
} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import { ChatService, api } from '../services/chat.service';
import { Router } from '@angular/router';
import { Userr, mockUsers } from '../services/mockData';
import { ApiService, Message, User } from '../services/api.service';

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
    FormsModule
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})

export class ChatComponent implements OnInit {
  currentUser: User = {} as User;
  users: User[] = []; //mockUsers;
  user: User = {} as User;
  messages: Message[] = [];

  chatForm: FormGroup = new FormGroup({
    message: new FormControl(),
    searchText: new FormControl()
  });

  constructor(
    private chatService: ChatService,
    private router: Router,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.chatService.start();
    this.refleshMessages();
    this.chatForm.get('searchText')?.valueChanges.subscribe(result => {
      this.getUsers();
    });
    this.apiService.getCurrentUser().subscribe(
      (response: User) => {
        console.log(response);
      this.currentUser = response;
      console.log('Current user:', this.currentUser);
    },
    (error) => {
      console.error('Error fetching current user:', error);
    });
  }

  sendMessage(): void {
    if (this.chatForm.get('message')?.value.trim() === '') {
      return;
    }
    this.chatService.sendMessage('1', '2', this.chatForm.get('message')?.value);
    this.refleshMessages();
    this.chatForm.get('message')?.setValue('');
  }

  refleshMessages(){
    if(!this.user){
      console.log("user not found");
      return;
    }
    if(!this.user?.messages){
      return;
    }
    this.messages = this.user?.messages
                              .sort((a, b) => {
                                const dateA = new Date(a.CreatedAt);
                                const dateB = new Date(b.CreatedAt);

                                if (dateA < dateB) {
                                  return -1;
                                } else if (dateA > dateB) {
                                  return 1;
                                } else {
                                  return 0;
                                }
                              })
                              .reverse();
  }

  chooseUser(userId: string): void {
    console.log(userId);
    this.apiService.getUser(userId).subscribe({
      next: (a)=>{
          this.user = a;
          console.log(this.user);
          this.refleshMessages();
      },
      error:(err:Error)=>{
        console.log(err.message);
      }
    });
  }

  getUsers(){
    if(this.chatForm.get('searchText')?.value){
      this.apiService.getUsers(this.chatForm.get('searchText')?.value).subscribe(
        (response: User[]) => {
          this.users = response
        }
      );
    }
    else{
      this.apiService.getAllChatUser().subscribe(
        (response: User[]) => {
          this.users = response;
        }
      );
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
  }

}
