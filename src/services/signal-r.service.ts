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
    this.hubConnection = this.buildConnection();
    this.registerOnServerEvents();
  }

  private buildConnection(): signalR.HubConnection {
    return new signalR.HubConnectionBuilder()
      .withUrl("http://45.130.148.137:8081/chat", {
        accessTokenFactory: () => `${this.apiService.getAccessToken()}`
      })
      .configureLogging(signalR.LogLevel.Information)
      .build();
  }

  public startConnection(): void {
    this.hubConnection
      .start()
      .then(() => console.log('SignalR connection started'))
      .catch(err => console.error('Error while starting SignalR connection:', err));
  }

  public async sendMessage(toUserId: string, message: string): Promise<void> {
    if (this.hubConnection.state === signalR.HubConnectionState.Connected) {
      try {
        await this.hubConnection.invoke('SendMessage', toUserId, message);
      } catch (err) {
        console.error('Error while sending message: ' + err);
        throw err;
      }
    } else {
      return Promise.reject('Hub connection is not connected.');
    }
  }

  public getMessageObservable(): Observable<{ fromUserId: string, message: string }> {
    return this.messageSubject.asObservable();
  }

  private registerOnServerEvents(): void {
    this.hubConnection.on('ReceiveMessage', (fromUserId: string, message: string) => {
      this.messageSubject.next({ fromUserId, message });
    });
  }

  public stopConnection(): void {
    if (this.hubConnection && this.hubConnection.state === signalR.HubConnectionState.Connected) {
      this.hubConnection.stop()
        .then(() => console.log('SignalR connection stopped'))
        .catch(err => console.error('Error while stopping SignalR connection:', err));
    }
  }
}
