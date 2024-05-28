export interface Role {
  id: number;
  name: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  msg: string;
  isSeen: boolean;
  seenAt: Date;
  createdAt: Date;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
  createdAt: string;
  isDeleted: boolean;
  unReadedMessageCount: number;
  messages: Message[];
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  accessToken: string;
}

export interface RegisterRequest {
  FirstName: string;
  LastName: string;
  Email: string;
  ConfirmCode: string;
  Password: string;
  ConfirmPassword: string;
  Photo?: File | null;
}

export interface ResetPasswordRequest {
  email: string;
  newPassword: string;
  confirmNewPassword: string;
  confirmationCode: number;
}

export interface ChangePasswordRequest {
  email: string;
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface SendConfirmationCodeRequest {
  email: string;
}
