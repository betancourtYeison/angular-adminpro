import { Injectable } from "@angular/core";
import { User } from "src/app/models/user.model";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { map } from "rxjs/operators";
import { URL_SERVICES } from "../../config/config";
import { Router } from "@angular/router";
import Swal from "sweetalert2";

@Injectable({
  providedIn: "root"
})
export class UserService {
  user: User;
  token: string;

  constructor(public _http: HttpClient, public router: Router) {
    this.loadStorage();
  }

  isLoggedIn() {
    return this.token && this.token.length > 5;
  }

  loadStorage() {
    this.user = JSON.parse(localStorage.getItem("user"));
    this.token = localStorage.getItem("token");
  }

  saveStorage(response) {
    localStorage.setItem("id", response.id);
    localStorage.setItem("token", response.token);
    localStorage.setItem("user", JSON.stringify(response.user));

    this.user = response.user;
    this.token = response.token;
  }

  logout() {
    this.user = null;
    this.token = null;
    localStorage.removeItem("id");
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    this.router.navigate(["/login"]);
  }

  loginWithGoogle(token: string) {
    let url = `${URL_SERVICES}/login/google`;
    let headers = new HttpHeaders({
      "Content-Type": "application/json"
    });

    return this._http.post(url, { token }, { headers }).pipe(
      map((response: any) => {
        this.saveStorage(response);
        return response.user;
      })
    );
  }

  login(user: User, rememberme: boolean = false) {
    let url = `${URL_SERVICES}/login`;
    let headers = new HttpHeaders({
      "Content-Type": "application/json"
    });

    return this._http.post(url, user, { headers }).pipe(
      map((response: any) => {
        if (rememberme) {
          localStorage.setItem("email", user.email);
        } else {
          localStorage.removeItem("email");
        }
        this.saveStorage(response);
        return response.user;
      })
    );
  }

  createUser(user: User) {
    let url = `${URL_SERVICES}/user`;
    let headers = new HttpHeaders({
      "Content-Type": "application/json"
    });

    return this._http.post(url, user, { headers }).pipe(
      map((response: any) => {
        Swal.fire({
          title: "User created",
          text: user.email,
          type: "success"
        });
        return response.user;
      })
    );
  }
}
