import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { resetFakeAsyncZone } from '@angular/core/testing';
import { Observable } from 'rxjs';

export const api: string = "";

export interface User {
  Id: string,
  FirstName: string,
  LastName: string,
  Email: string,
  Role: UserRole,
  CreatedAt: Date,
  Photos: ProfilePhoto[],
  Messages: Message[]
}

export enum UserRole{
  Unknown = 0,
  User = 1,
  Admin = 2,
  SuperAdmin = 3,
}

export interface ProfilePhoto{
  Id: string,
  UserId: string,
  PhotoName: string,
  CreatedAt: Date
}

export interface Message{
  Id: string,
  SenderId: string,
  ChatId: string,
  Msg: string,
  IsSeen: boolean,
  SeenAt: Date,
  CreatedAt: Date
}

export interface Chat{
  Id: string,
  CreatedAt: Date,
  Messages: Message[]
}

export interface LoginDto{
  Email: string,
  Password: string
}

export interface RegisterDto{
  FirstName: string,
  LastName: string,
  Email: string,
  ConfirmCode: string,
  Password: string,
  ConfirmPassword: string,
  Photo: File
}

export interface ChangePasswordDto{
  Email: string,
  OldPassword: string,
  NewPassword: string,
  ConfirmPassword: string
}

export interface ResetPasswordDto{
  Email: string,
  NewPassword: string,
  ConfirmNewPassword: string,
  ConfirmationCode: string
}

export interface SendConfirmCodeDto{
  Email: string
}

export interface LoginViewModel{
  User: User,
  AccessToken: string
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private http: HttpClient) { }

  public Login(loginDto: LoginDto){
    this.http.post(api, loginDto);
  }

  private formatDate(date: Date): string {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    };
    return date.toLocaleDateString('en-US', options);
  }
}
