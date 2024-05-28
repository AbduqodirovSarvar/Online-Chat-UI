import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http"
import { Injectable } from "@angular/core"
import { Observable } from "rxjs";
import { ApiService } from "../services/api.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private apiService: ApiService) {}
  intercept(httpRequest: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

     if (this.apiService.getAccessToken()) {
      const authReq = httpRequest.clone({
        setHeaders: {
          Authorization: `Bearer ${this.apiService.getAccessToken()}`,
        }
      });
      return next.handle(authReq);
    }
    return next.handle(httpRequest);
  }
}
