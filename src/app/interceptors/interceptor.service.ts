import { Injectable } from "@angular/core";
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpHeaders
} from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { HttpErrorResponse } from "@angular/common/http";
import { catchError } from "rxjs/operators";
import Swal from "sweetalert2";

@Injectable({
  providedIn: "root"
})
export class InterceptorService implements HttpInterceptor {
  constructor() {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const headers = new HttpHeaders({
      "Content-Type": "application/json"
    });
    const reqClone = req.clone({ headers });
    return next.handle(reqClone).pipe(catchError(this.handleError));
  }

  handleError(err: HttpErrorResponse) {
    if (err.error && err.error.errors && err.error.errors.message) {
      Swal.fire({
        title: err.error.message,
        text: err.error.errors.message,
        type: "error"
      });
    } else if (err.error && err.error.message) {
      Swal.fire({
        title: "Login Error",
        text: err.error.message,
        type: "error"
      });
    }
    return throwError(err);
  }
}
