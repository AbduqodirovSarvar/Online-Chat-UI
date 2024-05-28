import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { Observable, Subject } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  private hubConnection!: signalR.HubConnection;
  private messageSubject = new Subject<{ fromUserId: string, message: string }>();

  constructor(
    private apiService: ApiService
  ) {
    this.startConnection();
   }

  public startConnection(): void {
    this.hubConnection = new signalR.HubConnectionBuilder()
        .withUrl("http://localhost:5038/chat", {
          accessTokenFactory: () => `${this.apiService.getAccessToken()}`
        })
        .configureLogging(signalR.LogLevel.Information)
        .build();

    this.hubConnection.start()
      .then(() => console.log('SignalR connection started'))
      .catch(err => console.error('Error while starting SignalR connection:', err));

    this.hubConnection.on('ReceiveMessage', (fromUserId: string, message: string) => {
      console.log(`Message comes from ${fromUserId}\nMessage: ${message}`);
      this.messageSubject.next({ fromUserId, message });
    });
  }

  public sendMessage(toUserId: string, message: string): void {
    if (this.hubConnection.state === 'Connected') {
      console.log(`Message sent to: ${toUserId}\nMessage: ${message}`);
      this.hubConnection.invoke('SendMessage', toUserId, message)
        .catch(err => console.error('Error while sending message:', err));
    }
  }

  public getMessageObservable(): Observable<{ fromUserId: string, message: string }> {
    return this.messageSubject.asObservable();
  }

  public stopConnection(): void {
    if (this.hubConnection && this.hubConnection.state === 'Connected') {
      this.hubConnection.stop()
        .then(() => console.log('SignalR connection stopped'))
        .catch(err => console.error('Error while stopping SignalR connection:', err));
    }
  }
}
