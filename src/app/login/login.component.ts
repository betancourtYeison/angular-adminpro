import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { NgForm } from "@angular/forms";
import { UserService } from "../services/user/user.service";
import { User } from "../models/user.model";

declare function init_plugins();
declare const gapi: any;

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"]
})
export class LoginComponent implements OnInit {
  email: string;
  rememberme: boolean = false;

  auth2: any;

  constructor(public router: Router, public _userService: UserService) {}

  ngOnInit() {
    init_plugins();
    this.googleInit();
    this.email = localStorage.getItem("email") || "";
    if (this.email.length > 0) {
      this.rememberme = true;
    }
  }

  googleInit() {
    gapi.load("auth2", () => {
      this.auth2 = gapi.auth2.init({
        client_id:
          "742210258149-2ouo5264ru5b3l875ovvlvv6tkekbgb3.apps.googleusercontent.com",
        cookiepolicy: "single_host_origin",
        scope: "profile email"
      });
      this.attachSignin(document.getElementById("btnGoogle"));
    });
  }

  attachSignin(element) {
    this.auth2.attachClickHandler(element, {}, googleUser => {
      // let profile = googleUser.getBasicProfile();
      // console.log(profile);
      let token = googleUser.getAuthResponse().id_token;

      this._userService
        .loginWithGoogle(token)
        .subscribe(() => (window.location.href = "#/dashboard"));
    });
  }

  login(formLogin: NgForm) {
    if (formLogin.invalid) return;

    let user = new User(null, formLogin.value.email, formLogin.value.password);

    this._userService
      .login(user, formLogin.value.rememberme)
      .subscribe(() => this.router.navigate(["/dashboard"]));
  }
}
