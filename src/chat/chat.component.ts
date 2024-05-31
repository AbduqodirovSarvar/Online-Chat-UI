import { Component, OnInit } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { CommonModule } from '@angular/common';
import { CdkAccordionModule } from '@angular/cdk/accordion';
import { FormControl, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { SignalRService } from '../services/signal-r.service';
import { MarkAsReadRequest, Message, User } from '../data/DataTypes';
import { MatBadgeModule } from '@angular/material/badge';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { UserSettingsDialogComponent } from '../user-settings-dialog/user-settings-dialog.component';

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
    MatBadgeModule
  ],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  currentUser: User = {} as User;
  users: User[] = [];
  user: User = {} as User;
  messages: Message[] = [];
  messageSubscription!: Subscription;
  storageAp: string = "http://localhost:5038/api/Storage";

  chatForm: FormGroup = new FormGroup({
    message: new FormControl('', Validators.required),
    searchText: new FormControl('')
  });

  constructor(
    private signalRService: SignalRService,
    private router: Router,
    private apiService: ApiService,
    private dialog: MatDialog
  ) {}

  async ngOnInit() {
    await this.initializeChat();
  }

  private async initializeChat(){
    await this.loadCurrentUser();
    await this.loadAllChatUsers();
    if (this.users.length > 0) {
      await this.chooseUser(this.users[0].id);
    }
    this.setupSearchTextHandler();
    this.setupSignalRConnection();
  }

  openUpdateUserDialog(){
    this.dialog.open(UserSettingsDialogComponent).afterClosed().subscribe({
      next: async () => {
        await this.loadCurrentUser();
        await this.loadAllChatUsers();
        await this.chooseUser(this.user.id);
      },
      error: (error: Error) => {
        this.apiService.handleError(error);
      }
    });
  }

  private loadCurrentUser(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.apiService.getCurrentUser().subscribe({
        next: (user: User) => {
          this.currentUser = user;
          resolve();
        },
        error: (error) => {
          console.error('Error fetching current user:', error);
          reject(error);
        }
      });
    });
  }

  private loadAllChatUsers(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.apiService.getAllChatUsers().subscribe({
        next: (users: User[]) => {
          this.users = users;
          console.log(this.users);
          resolve();
        },
        error: (error) => {
          console.error('Error fetching chat users:', error);
          reject(error);
        }
      });
    });
  }

  async chooseUser(userId: string): Promise<void> {
    this.apiService.markAsRead(userId).subscribe({
      next: () => {
        this.apiService.getUser(userId, null).subscribe({
          next: (user: User) => {
            this.user = user;
            this.messages = user.messages;
            this.chatForm.get('searchText')?.setValue('');
          },
          error: (error) => {
            console.error('Error fetching user:', error);
          }
        });
      },
      error: (error) => {
        console.error('Error marking messages as read:', error);
      }
    });
  }

  private setupSearchTextHandler(): void {
    this.chatForm.get('searchText')?.valueChanges.subscribe({
      next: (text: string) => {
        if (text.trim() === '') {
          this.loadAllChatUsers();
        } else {
          this.searchUsers(text);
        }
      },
      error: (error) => {
        console.error('Error handling search text changes:', error);
      }
    });
  }

  private searchUsers(searchText: string): void {
    this.apiService.getUsers(searchText).subscribe({
      next: (users: User[]) => {
        this.users = users;
      },
      error: (error) => {
        console.error('Error fetching users:', error);
      }
    });
  }

  sendMessage(): void {
    const messageContent = this.chatForm.get('message')?.value.trim();
    if (messageContent === '') return;

    this.signalRService.sendMessage(this.user.id, messageContent).then(() => {
      this.loadAllChatUsers();
      this.chooseUser(this.user.id);
      this.chatForm.get('message')?.setValue('');
    }).catch(error => {
      console.error('Error sending message:', error);
    });
  }

  handleKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.keyCode === 13) {
      this.sendMessage();
    }
  }

  logOut(): void {
    this.router.navigate(['/login']);
    localStorage.removeItem('accessToken');
    this.signalRService.stopConnection();
  }

  private setupSignalRConnection(): void {
    this.signalRService.startConnection();
    this.signalRService.getMessageObservable().subscribe({
      next: ({ fromUserId, message }) => {
        this.loadAllChatUsers();
        this.chooseUser(this.user.id);
        console.log(`From User: ${fromUserId}\nMessage: ${message}`);
      },
      error: (error) => {
        console.error('Error receiving message:', error);
      }
    });
  }
}
