import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, catchError, tap } from 'rxjs';
import { Router } from '@angular/router';

const api: string = "http://localhost:5038/api";
const photoApi: string = "";
const tokeen = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6ImY0NzcwZmE5LTlmYWItNDZiNy1hZGNmLTNlNmRkOTY0ZjdmZiIsImp0aSI6ImIxOTNiNGZmLWRhYTQtNDhmMC04MWE3LTg2N2U3ZDQ4N2VhZSIsIm5hbWUiOiIyNy8wNS8yMDI0IDA5OjIxOjExIiwiZXhwIjoxNzE2ODg4MDcxLCJpc3MiOiJsb2NhbGhvc3QiLCJhdWQiOiJsb2NhbGhvc3QifQ.2SD0jCLEr22kOSyVb1myz6zvjcH4544demUG2707Q28';

export interface RegisterDto {
  FirstName: string;
  LastName: string;
  Email: string;
  ConfirmCode: string;
  Password: string;
  ConfirmPassword: string;
  Photo?: File | null;
}

export interface LoginDto {
  Email: string;
  Password: string;
}

export interface SendConfirmationCode {
  email: string;
}

export interface ResetPasswordDto {
  Email: string;
  ConfirmationCode: string;
  NewPassword: string;
  ConfirmNewPassword: string;
}

export interface ChangePasswordDto {
  email: string;
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface User{
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  photoName?: string;
  CreatedAt: Date,
  messages: Message[],
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  msg: string;
  isSeen: boolean;
  seenAt: Date;
  CreatedAt: Date
}

export enum UserRole {
  User = 'User',
  Admin = 'Admin'
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  register(registerDto: RegisterDto): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('FirstName', registerDto.FirstName);
    formData.append('LastName', registerDto.LastName);
    formData.append('Email', registerDto.Email);
    formData.append('ConfirmCode', registerDto.ConfirmCode);
    formData.append('Password', registerDto.Password);
    formData.append('ConfirmPassword', registerDto.ConfirmPassword);
    if (registerDto.Photo) {
      formData.append('Photo', registerDto.Photo);
    }
    return this.http.post<any>(`${api}/Auth/register`, formData);
  }

  login(loginDto: LoginDto): Observable<any> {
    return this.http.post<any>(`${api}/Auth/login`, loginDto).pipe(
      tap(response => {
        if (response && response.accessToken) {
          this.saveAccessToken(response.accessToken);
        }
      })
    );
  }

  sendConfirmationCode(sendConfirmationCode: SendConfirmationCode): Observable<any> {
    return this.http.post(`${api}/Auth/send-code-for-confirm-email`, sendConfirmationCode)
    .pipe(
      tap((res) => console.log(res)),
      catchError((error) => {
        console.error('Error sending confirmation code:', error);
        throw error;
      })
    );
  }

  sendResetConfirmationCode(sendConfirmationCode: SendConfirmationCode): Observable<any> {
    return this.http.post(`${api}/Auth/send-code-for-reset-password`, sendConfirmationCode)
    .pipe(
      tap((res) => console.log(res)),
      catchError((error) => {
        console.error('Error sending confirmation code:', error);
        throw error;
      })
    );
  }

  resetPassword(resetPasswordDto: ResetPasswordDto): Observable<any> {
    return this.http.post(`${api}/Auth/reset-password`, resetPasswordDto);
  }

  changePassword(changePassordDto: ChangePasswordDto){
    return this.http.put(`${api}/Auth/change-password`, changePassordDto);
  }

  getCurrentUser(): Observable<User> {
    // const headers = new HttpHeaders({
    //   'Authorization': `Bearer ${this.getAccessToken()}`,
    //   'Accept': 'application/json'
    // });
    console.log("CurrentUser:  ")
    return this.http.get<User>(`${api}/Users/me`); //, {headers}
  }

  getUser(userId: string): Observable<User> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${tokeen}`,
      'Accept': 'application/json'
    });
    let params = new HttpParams().set('id', userId).set('email', '');
    console.log(params.get('id'));
    return this.http.get<User>(`${api}/Users`, {headers: headers,params: params});
  }

  getUsers(searchText: string): Observable<User[]>{
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${tokeen}`,
      'Accept': 'application/json'
    });
    const params = new HttpParams();
    params.set('searchText', searchText);
    return this.http.get<User[]>(`${api}/Users/all-users`, {headers, params});
  }

  getAllChatUser(): Observable<User[]> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${tokeen}`,
      'Accept': 'application/json'
    });
    return this.http.get<User[]>(`${api}/Users/my-chats`, {headers});
  }

  getAllMessagesForTheChat(userId: string): Observable<any> {
    return this.http.get<any>(`${api}/chat-messages/${userId}`);
  }

  getPhoto(userId: string){
    return this.http.get<any>(`${api}/Storage/${userId}`);
  }

  editUser(newUserUpdateDto: object): Observable<any> {
    return this.http.put<any>(`${api}/Users/update`, newUserUpdateDto);
  }

  deleteUser(userId: string){
    return this.http.delete<any>(`${api}/Users/${userId}`);
  }

  deleteUserPhoto(userId: string){
    return this.http.delete<any>(`${api}/Users/photo/${userId}`);
  }

  redirectToLoginPage(){
    this.router.navigate(['/login']);
    this.removeAccessToken();
  }

  saveAccessToken(accessToken: string){
    localStorage.setItem('accessToken', accessToken);
  }

  getAccessToken(): string | null{
    return localStorage.getItem('accessToken');
  }

  removeAccessToken(): void{
    localStorage.removeItem('accessToken');
  }

  savetoLocalStorage(key: string, value: string): void{
    localStorage.setItem(key, value);
  }

  getFromLocalStorage(key: string): string | null {
    return localStorage.getItem(key);
  }

  removeFromLocalStorage(key: string): void{
    localStorage.removeItem(key);
  }
}
