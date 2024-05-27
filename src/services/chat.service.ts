import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as signalR from '@microsoft/signalr';

export const api: string = "http://localhost:5038/api";

export interface Use {
  name: string;
}

@Injectable({
  providedIn: 'root'
})

export class ChatService {

  public connection: signalR.HubConnection;

  constructor() {
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl("http://localhost:5038/chat")
      .configureLogging(signalR.LogLevel.Information)
      .build();

    this.connection.on('ReceiveMessage', (senderId: string, receiverId: string, message: string) => {
      console.log(senderId, receiverId, message);
    });

    this.connection.on("Connected", (user: Use) => {
      console.log(`${user.name} has joined the chat.`);
    });

    this.connection.on("Disconnected", (user: Use) => {
      console.log(`${user.name} has left the chat.`);
    });
  }

  public async start() {
    try {
      await this.connection.start();
      console.log("SignalR connected.");
    } catch (error) {
      console.log("SignalR connection error: ", error);
      setTimeout(() => this.start(), 5000);
    }
  }

  public addReceiveMessageListener(callback: (user: string, message: string) => void): void {
    this.connection.on('ReceiveMessage', (user, message) => {
      callback(user, message);
    });
  }

  public sendMessage(toUserId: string, fromUserId: string, message: string): void {
    console.log("SendMessage");
    this.connection.invoke('SendMessage', toUserId, fromUserId, message)
      .catch(err => console.error(err));
  }

  public async register(user: Use) {
    try {
      await this.connection.send("Register", user);
    } catch (error) {
      console.error("Register user error: ", error);
    }
  }

}
