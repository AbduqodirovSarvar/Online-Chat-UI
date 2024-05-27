import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { ChatComponent } from '../../src/chat/chat.component';
import { ChatService } from '../services/chat.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HeaderInterceptor } from './auth.interceptor';

@NgModule({
  declarations: [

  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS, useClass: HeaderInterceptor, multi:true
    },
  ],
})
export class AppModule { }
