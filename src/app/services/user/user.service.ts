import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
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
  id: string;
  token: string;
  user: User;
  menu: any = [];

  constructor(
    public _http: HttpClient,
    public router: Router,
    public _uploadService: UploadService
  ) {
    this.loadStorage();
  }

  renewToken() {
    let url = `${URL_SERVICES}/login/renewToken?token=${this.token}`;
    return this._http.get(url).pipe(
      map((response: any) => {
        this.saveStorage(this.id, response.token, this.user, this.menu);
        return response.token;
      }),
      catchError(err => {
        this.router.navigate(["/login"]);
        Swal.fire({
          title: "Token Error",
          text: "Can not renew token",
          type: "error"
        });
        return throwError(err);
      })
    );
  }

  isLoggedIn() {
    return this.token && this.token.length > 5;
  }

  loadStorage() {
    this.id = localStorage.getItem("id");
    this.user = JSON.parse(localStorage.getItem("user"));
    this.token = localStorage.getItem("token");
    this.menu = JSON.parse(localStorage.getItem("menu"));
  }

  saveStorage(id: string, token: string, user: User, menu: any) {
    localStorage.setItem("id", id);
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("menu", JSON.stringify(menu));

    this.id = id;
    this.token = token;
    this.user = user;
    this.menu = menu;
  }

  logout() {
    this.id = null;
    this.token = null;
    this.user = null;
    this.menu = null;

    localStorage.removeItem("id");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("menu");

    this.router.navigate(["/login"]);
  }

  loginWithGoogle(token: string) {
    let url = `${URL_SERVICES}/login/google`;
    return this._http.post(url, { token }).pipe(
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
    return this._http.post(url, user).pipe(
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
      })
    );
  }

  searchUser(search: string) {
    let url = `${URL_SERVICES}/search/collection/users/${search}`;
    return this._http.get(url).pipe(map((response: any) => response.users));
  }

  loadUser(id: string) {
    let url = `${URL_SERVICES}/user/${id}`;
    return this._http.get(url);
  }

  loadUsers(from: number = 0) {
    let url = `${URL_SERVICES}/user?from=${from}`;
    return this._http.get(url);
  }

  createUser(user: User) {
    let url = `${URL_SERVICES}/user`;
    return this._http.post(url, user).pipe(
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

  updateUser(user: User) {
    let url = `${URL_SERVICES}/user/${user._id}?token=${this.token}`;
    return this._http.put(url, user).pipe(
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
      })
    );
  }

  deleteUser(id: string) {
    let url = `${URL_SERVICES}/user/${id}?token=${this.token}`;
    return this._http.delete(url).pipe(
      map((response: any) => {
        Swal.fire("Deleted!", "User has been deleted.", "success");
        return response.user;
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
