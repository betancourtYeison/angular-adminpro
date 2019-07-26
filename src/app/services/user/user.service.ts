import { Injectable } from "@angular/core";
import { User } from "src/app/models/user.model";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { map } from "rxjs/operators";
import { URL_SERVICES } from "../../config/config";
import { Router } from "@angular/router";
import { UploadService } from "../upload/upload.service";
import Swal from "sweetalert2";

@Injectable({
  providedIn: "root"
})
export class UserService {
  user: User;
  token: string;

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
    this.user = JSON.parse(localStorage.getItem("user"));
    this.token = localStorage.getItem("token");
  }

  saveStorage(id: string, token: string, user: User) {
    localStorage.setItem("id", id);
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    this.user = user;
    this.token = token;
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
        this.saveStorage(response.id, response.token, response.user);
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
        this.saveStorage(response.id, response.token, response.user);
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
          this.saveStorage(userResponse._id, this.token, userResponse);
        }
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
        this.saveStorage(id, this.token, this.user);
      })
      .catch(err => console.log(err));
  }

  loadUsers(from: number = 0) {
    let url = `${URL_SERVICES}/user?from=${from}`;
    let headers = new HttpHeaders({
      "Content-Type": "application/json"
    });
    return this._http.get(url, { headers });
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

  deleteUser(id: string) {
    let url = `${URL_SERVICES}/user/${id}?token=${this.token}`;
    let headers = new HttpHeaders({
      "Content-Type": "application/json"
    });

    return this._http.delete(url, { headers }).pipe(
      map((response: any) => {
        Swal.fire("Deleted!", "User has been deleted.", "success");
        return response.user;
      })
    );
  }
}
