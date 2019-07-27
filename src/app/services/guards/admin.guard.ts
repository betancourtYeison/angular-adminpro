import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { UserService } from "../user/user.service";

@Injectable({
  providedIn: "root"
})
export class AdminGuard implements CanActivate {
  constructor(public _userService: UserService, public router: Router) {}

  canActivate() {
    if (this._userService.user.role === "ADMIN_ROLE") {
      return true;
    } else {
      this.router.navigate(["/"]);
      return false;
    }
  }
}
