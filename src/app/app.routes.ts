import { Routes } from '@angular/router';
import { ChatComponent } from '../chat/chat.component';
import { LoginComponent } from '../login/login.component';
import { RegisterComponent } from '../register/register.component';
import { ResetComponent } from '../reset/reset.component';

export const routes: Routes = [
  {path: "", redirectTo: "chat", pathMatch: "full" },
  {path: "login", component: LoginComponent},
  {path: "register", component: RegisterComponent},
  {path: "forgot-password", component: ResetComponent},
  {path: "chat", component: ChatComponent},
];


