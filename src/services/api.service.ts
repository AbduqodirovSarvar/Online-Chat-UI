import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { User, RegisterRequest, LoginRequest, LoginResponse, ResetPasswordRequest, ChangePasswordRequest, SendConfirmationCodeRequest, MarkAsReadRequest, UpdateUserRequest } from '../data/DataTypes';

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

  login(loginDto: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${authApi}/login`, loginDto);
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
    return this.http.post<any>(`${authApi}/send-confirmation-code-for-check-email`, sendConfirmationCode);
  }

  sendResetConfirmationCode(sendConfirmationCode: SendConfirmationCodeRequest): Observable<any> {
    return this.http.post<any>(`${authApi}/send-confirmation-code-for-reset-password`, sendConfirmationCode);
  }

  resetPassword(resetPasswordDto: ResetPasswordRequest): Observable<any> {
    return this.http.post<any>(`${authApi}/reset-password`, resetPasswordDto);
  }

  changePassword(changePasswordDto: ChangePasswordRequest): Observable<any> {
    return this.http.put<any>(`${authApi}/change-password`, changePasswordDto);
  }

  // --> end Auth services


  // --> start User services

  getCurrentUser(): Observable<User> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getAccessToken()}`,
      'Accept': 'application/json'
    });

    return this.http.get<User>(`${userApi}/me`, { headers });
  }

  getUser(userId: string | null, email: string | null): Observable<User> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getAccessToken()}`,
      'Accept': 'application/json'
    });
    userId = userId ?? '';
    email = email ?? '';
    let params = new HttpParams().set('id', userId).set('email', email);

    return this.http.get<User>(`${userApi}`, { headers, params });
  }

  getUsers(searchText: string): Observable<User[]> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getAccessToken()}`,
      'Accept': 'application/json'
    });
    const params = new HttpParams().set('searchText', searchText);

    return this.http.get<User[]>(`${userApi}/all`, { headers, params });
  }

  getAllChatUsers(): Observable<User[]> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getAccessToken()}`,
      'Accept': 'application/json'
    });

    return this.http.get<User[]>(`${userApi}/my-chats`, { headers });
  }

  getAllMessagesForTheChat(userId: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getAccessToken()}`,
      'Accept': 'application/json'
    });

    return this.http.get<any>(`${userApi}/chat-messages/${userId}`, { headers });
  }

  editUser(userUpdateDto: UpdateUserRequest): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getAccessToken()}`,
      'Accept': 'application/json'
    });

    const formData: FormData = new FormData();
    formData.append("Id", userUpdateDto.id);
    if(userUpdateDto.firstName){
      formData.append("firstName", userUpdateDto.firstName);
    }
    if(userUpdateDto.lastName){
      formData.append("LastName", userUpdateDto.lastName);
    }
    if(userUpdateDto.photo){
      formData.append("Photo", userUpdateDto.photo);
    }

    return this.http.put<any>(`${userApi}/update`, formData, { headers });
  }

  deleteUser(userId: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getAccessToken()}`,
      'Accept': 'application/json'
    });

    return this.http.delete<any>(`${userApi}/${userId}`, { headers });
  }

  deleteUserPhoto(userId: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getAccessToken()}`,
      'Accept': 'application/json'
    });

    return this.http.delete<any>(`${userApi}/photo/${userId}`, { headers });
  }

  // --> end User services

  // --> start Storage services

  getPhoto(fileName: string): Observable<any> {
    return this.http.get<any>(`${storageApi}/${fileName}`);
  }

  // --> end Storage services

  // --> start Message services

  markAsRead(userId: string): Observable<boolean> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getAccessToken()}`,
      'Content-Type': 'application/json'
    });
    const params = new HttpParams().set('UserId', userId);

    return this.http.get<boolean>(`${messageApi}/mark-as-read`, { headers, params });
  }

  // --> end Message services

  // --> start Other help services

  handleError(error: any): never {
    if (error.status === 401) {
      // Unauthorized error, redirect to login page
      this.redirectToLoginPage();
    }
    console.error('An error occurred:', error);
    throw error;
  }

  checkForStrongPassword(password: string){
    const strongPasswordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return strongPasswordPattern.test(password);
  }

  redirectToLoginPage(): void {
    this.router.navigate(['/login']);
    this.removeAccessToken();
  }

  saveAccessToken(accessToken: string): void {
    localStorage.setItem('accessToken', accessToken);
  }

  getAccessToken(): string | null {
    const token = localStorage.getItem('accessToken');
    if (token && !this.isTokenExpired(token)) {
      return token;
    } else {
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

  removeAccessToken(): void {
    localStorage.removeItem('accessToken');
  }

  savetoLocalStorage(key: string, value: string): void {
    localStorage.setItem(key, value);
  }

  getFromLocalStorage(key: string): string | null {
    return localStorage.getItem(key);
  }

  removeFromLocalStorage(key: string): void {
    localStorage.removeItem(key);
  }

  // --> end Other help services
}
