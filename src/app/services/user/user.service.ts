import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { throwError } from "rxjs";
import { map, catchError } from "rxjs/operators";
import { URL_SERVICES } from "../../config/config";
import { User } from "../../models/user.model";
import { UploadService } from "../upload/upload.service";
import Swal from "sweetalert2";

@Injectable({
  providedIn: "root"
})
export class UserService {
  user: User;
  token: string;
  menu: any = [];

  constructor(
    public _http: HttpClient,
    public router: Router,
    public _uploadService: UploadService
  ) {
    this.loadStorage();
  }

  isLoggedIn() {
    return this.token && this.token.length > 5;
  }

  loadStorage() {
    this.menu = JSON.parse(localStorage.getItem("menu"));
    this.user = JSON.parse(localStorage.getItem("user"));
    this.token = localStorage.getItem("token");
  }

  saveStorage(id: string, token: string, user: User, menu: any) {
    localStorage.setItem("id", id);
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("menu", JSON.stringify(menu));

    this.user = user;
    this.token = token;
    this.menu = menu;
  }

  logout() {
    this.user = null;
    this.token = null;
    this.menu = null;

    localStorage.removeItem("id");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("menu");

    this.router.navigate(["/login"]);
  }

  loginWithGoogle(token: string) {
    let url = `${URL_SERVICES}/login/google`;
    let headers = new HttpHeaders({
      "Content-Type": "application/json"
    });

    return this._http.post(url, { token }, { headers }).pipe(
      map((response: any) => {
        this.saveStorage(
          response.id,
          response.token,
          response.user,
          response.menu
        );
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
        this.saveStorage(
          response.id,
          response.token,
          response.user,
          response.menu
        );
        return response.user;
      }),
      catchError(err => {
        Swal.fire({
          title: "Login Error",
          text: err.error.message,
          type: "error"
        });
        return throwError(err);
      })
    );
  }

  searchUser(search: string) {
    let url = `${URL_SERVICES}/search/collection/users/${search}`;
    let headers = new HttpHeaders({
      "Content-Type": "application/json"
    });
    return this._http
      .get(url, { headers })
      .pipe(map((response: any) => response.users));
  }

  loadUser(id: string) {
    let url = `${URL_SERVICES}/user/${id}`;
    let headers = new HttpHeaders({
      "Content-Type": "application/json"
    });
    return this._http.get(url, { headers });
  }

  loadUsers(from: number = 0) {
    let url = `${URL_SERVICES}/user?from=${from}`;
    let headers = new HttpHeaders({
      "Content-Type": "application/json"
    });
    return this._http.get(url, { headers });
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
      }),
      catchError(err => {
        Swal.fire({
          title: err.error.message,
          text: err.error.errors.message,
          type: "error"
        });
        return throwError(err);
      })
    );
  }

  updateUser(user: User) {
    let url = `${URL_SERVICES}/user/${user._id}?token=${this.token}`;
    let headers = new HttpHeaders({
      "Content-Type": "application/json"
    });
    return this._http.put(url, user, { headers }).pipe(
      map((response: any) => {
        Swal.fire({
          title: "User updated",
          text: user.email,
          type: "success"
        });
        if (user._id === this.user._id) {
          let userResponse: User = response.user;
          this.saveStorage(
            userResponse._id,
            this.token,
            userResponse,
            this.menu
          );
        }
        return response.user;
      }),
      catchError(err => {
        Swal.fire({
          title: err.error.message,
          text: err.error.errors.message,
          type: "error"
        });
        return throwError(err);
      })
    );
  }

  deleteUser(id: string) {
    let url = `${URL_SERVICES}/user/${id}?token=${this.token}`;
    let headers = new HttpHeaders({
      "Content-Type": "application/json"
    });

    return this._http.delete(url, { headers }).pipe(
      map((response: any) => {
        Swal.fire("Deleted!", "User has been deleted.", "success");
        return response.user;
      }),
      catchError(err => {
        Swal.fire({
          title: err.error.message,
          text: err.error.errors.message,
          type: "error"
        });
        return throwError(err);
      })
    );
  }

  changeImage(file: File, id: string) {
    this._uploadService
      .upload(file, "users", id)
      .then((response: any) => {
        Swal.fire({
          title: "Image updated",
          text: this.user.email,
          type: "success"
        });

        this.user.img = response.users.img;
        this.saveStorage(id, this.token, this.user, this.menu);
      })
      .catch(err => {
        Swal.fire({
          title: err.message,
          text: err.errors.message,
          type: "error"
        });
      });
  }
}
