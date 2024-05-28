import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, catchError, tap } from 'rxjs';
import { Router } from '@angular/router';
import {
  User,
  Role,
  Message,
  RegisterRequest,
  LoginRequest,
  LoginResponse,
  ResetPasswordRequest,
  ChangePasswordRequest,
  SendConfirmationCodeRequest
} from '../data/DataTypes';

const commonApi: string = "http://localhost:5038/api";
const authApi: string = "http://localhost:5038/api/Auth";
const messageApi: string = "http://localhost:5038/api/Message";
const userApi: string = "http://localhost:5038/api/User";
const storageApi: string = "http://localhost:5038/api/Storage";


@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  // --> start Auth services

  login(loginDto: LoginRequest): Observable<any> {
    return this.http.post<any>(`${authApi}/login`, loginDto).pipe(
      tap((response: LoginResponse) => {
        if (response && response.accessToken) {
          this.saveAccessToken(response.accessToken);
        }
      })
    );
  }

  register(registerDto: RegisterRequest): Observable<any> {
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
    return this.http.post<any>(`${authApi}/register`, formData);
  }

  sendConfirmationCode(sendConfirmationCode: SendConfirmationCodeRequest): Observable<any> {
    return this.http.post(`${authApi}/send-confirmation-code-for-check-email`, sendConfirmationCode)
    .pipe(
      tap((res) => console.log(res)),
      catchError((error) => {
        console.error('Error sending confirmation code:', error);
        throw error;
      })
    );
  }

  sendResetConfirmationCode(sendConfirmationCode: SendConfirmationCodeRequest): Observable<any> {
    return this.http.post(`${authApi}/send-confirmation-code-for-reset-password`, sendConfirmationCode)
    .pipe(
      tap((res) => console.log(res)),
      catchError((error) => {
        console.error('Error sending confirmation code:', error);
        throw error;
      })
    );
  }

  resetPassword(resetPasswordDto: ResetPasswordRequest): Observable<any> {
    return this.http.post(`${authApi}/reset-password`, resetPasswordDto);
  }

  changePassword(changePassordDto: ChangePasswordRequest){
    return this.http.put(`${authApi}/change-password`, changePassordDto);
  }

  // --> end Auth services


  // --> start User services

  getCurrentUser(): Observable<User> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getAccessToken()}`,
      'Accept': 'application/json'
    });
    return this.http.get<User>(`${userApi}/me`, {headers}).pipe(
      catchError(error => this.handleError(error))
    );
  }

  getUser(userId: string | null, email: string | null): Observable<User> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getAccessToken()}`,
      'Accept': 'application/json'
    });
    userId = userId ?? '';
    email = email ?? '';
    let params = new HttpParams().set('id', userId).set('email', email);
    console.log(params.get('id'));
    return this.http.get<User>(`${userApi}`, {headers: headers,params: params}).pipe(
      catchError(error => this.handleError(error))
    );
  }

  getUsers(searchText: string): Observable<User[]>{
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getAccessToken()}`,
      'Accept': 'application/json'
    });
    const params = new HttpParams();
    params.set('searchText', searchText);
    return this.http.get<User[]>(`${userApi}/all`, {headers, params}).pipe(
      catchError(error => this.handleError(error))
      );
  }

  getAllChatUser(): Observable<User[]> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getAccessToken()}`,
      'Accept': 'application/json'
    });
    return this.http.get<User[]>(`${userApi}/my-chats`, {headers}).pipe(
      catchError(error => this.handleError(error))
    );
  }

  getAllMessagesForTheChat(userId: string): Observable<any> {
    return this.http.get<any>(`${userApi}/chat-messages/${userId}`).pipe(
      catchError(error => this.handleError(error))
    );
  }

  editUser(newUserUpdateDto: object): Observable<any> {
    return this.http.put<any>(`${userApi}/update`, newUserUpdateDto).pipe(
      catchError(error => this.handleError(error))
    );
  }

  deleteUser(userId: string){
    return this.http.delete<any>(`${userApi}/${userId}`);
  }

  deleteUserPhoto(userId: string){
    return this.http.delete<any>(`${userApi}/photo/${userId}`);
  }

  // --> end User services

  // --> start Storage services


  getPhoto(userId: string){
    return this.http.get<any>(`${storageApi}/${userId}`);
  }

  // --> end Storage services


  // --> start Message services

  markAsRead(userId: string): Observable<any> {
    return this.http.put<any>(`${messageApi}`, userId).pipe(
      catchError(error => this.handleError(error))
    );
  }

  // --> end Message services

  // --> start Other help services

  handleError(error: any): Observable<any> {
    if (error.status === 401) {
      // Unauthorized error, redirect to login page
      this.redirectToLoginPage();
    }
    return error;
  }

  redirectToLoginPage(){
    this.router.navigate(['/login']);
    this.removeAccessToken();
  }

  saveAccessToken(accessToken: string){
    localStorage.setItem('accessToken', accessToken);
  }

  getAccessToken(): string | null{
    const token = localStorage.getItem('accessToken');
    if(token && !this.isTokenExpired(token)){
      return localStorage.getItem('accessToken');
    }
    else{
      this.redirectToLoginPage();
      return null;
    }
  }

  private isTokenExpired(token: string): boolean {
    if (!token) return true;

    const payload = JSON.parse(atob(token.split('.')[1]));
    const expiry = payload.exp;
    const now = Math.floor((new Date).getTime() / 1000);

    return now >= expiry;
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

  // --> end Other help services
}
