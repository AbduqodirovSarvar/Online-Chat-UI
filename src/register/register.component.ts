import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ChatService } from '../services/chat.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {

  constructor(private router: Router){}

  clickRegister(){
    this.router.navigate(['/login']);
  }

  sendConfirmCode(){
    console.log("sended");
  }
}
