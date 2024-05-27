// import { HttpInterceptorFn } from '@angular/common/http';

import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http"
import { Injectable } from "@angular/core"
import { Observable } from "rxjs";
import { ApiService } from "../services/api.service";

// export const authInterceptor: HttpInterceptorFn = (req, next) => {
//   req.headers.set('Authorization', `Bearer `).set('Accept', 'application/json');
//   return next(req);
// };


@Injectable()
export class HeaderInterceptor implements HttpInterceptor {
  constructor(private apiService: ApiService) {}
  intercept(httpRequest: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
     const jwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6ImY0NzcwZmE5LTlmYWItNDZiNy1hZGNmLTNlNmRkOTY0ZjdmZiIsImp0aSI6ImQ5ZjFkMDgxLWM2YjktNGZhMS1iZGI1LTEzOTU0YTg5N2E1NSIsIm5hbWUiOiIyNy8wNS8yMDI0IDEzOjAxOjU1IiwiZXhwIjoxNzE2OTAxMzE1LCJpc3MiOiJsb2NhbGhvc3QiLCJhdWQiOiJsb2NhbGhvc3QifQ.53j-OQ9Xps-qEkfq1o3BMx0D5CXDq8K4VQimSWuJSyA'; // this.apiService.getAccessToken();

     const headers = {
      'Authorization': `Bearer ${jwt}`,
      'Accept': 'application/json'
    };

     return next.handle(httpRequest.clone({ setHeaders: headers}));
  }
}
