import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { UserService } from "../user/user.service";

@Injectable({
  providedIn: "root"
})
export class VerifyTokenGuard implements CanActivate {
  constructor(public _userService: UserService, public router: Router) {}

  canActivate(): Promise<boolean> | boolean {
    let token = this._userService.token;
    let payload = JSON.parse(atob(token.split(".")[1]));
    let exp = this.expireDate(payload.exp);

    if (exp) {
      this.router.navigate(["/login"]);
      return false;
    }

    return this.renewToken(payload.exp);
  }

  expireDate(exp: number) {
    let now = new Date().getTime() / 1000;
    return exp < now;
  }

  renewToken(exp: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
      let tokenExp = new Date(exp * 1000);
      let now = new Date();

      now.setTime(now.getTime() + 1 * 60 * 60 * 1000);

      if (tokenExp.getTime() > now.getTime()) {
        resolve(true);
      } else {
        this._userService
          .renewToken()
          .subscribe(() => resolve(true), () => reject(false));
      }
    });
  }
}
