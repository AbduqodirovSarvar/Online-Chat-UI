import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reset',
  standalone: true,
  imports: [],
  templateUrl: './reset.component.html',
  styleUrl: './reset.component.scss'
})
export class ResetComponent {
  constructor(private router: Router){}

  clickResetPassword(){
    this.router.navigate(['/login']);
  }

  sendResetCode(){
    console.log("sended");
  }
}
