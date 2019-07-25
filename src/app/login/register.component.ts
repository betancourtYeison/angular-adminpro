import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { UserService } from "../services/service.index";
import { User } from "../models/user.model";
import { Router } from "@angular/router";
import Swal from "sweetalert2";

declare function init_plugins();

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./login.component.css"]
})
export class RegisterComponent implements OnInit {
  formRegister: FormGroup;

  constructor(public _userService: UserService, public router: Router) {}

  ngOnInit() {
    init_plugins();

    this.formRegister = new FormGroup(
      {
        name: new FormControl(null, Validators.required),
        email: new FormControl(null, [Validators.required, Validators.email]),
        password: new FormControl(null, Validators.required),
        password2: new FormControl(null, Validators.required),
        terms: new FormControl(false)
      },
      { validators: this.fieldsMatch("password", "password2") }
    );

    this.formRegister.setValue({
      name: "test1",
      email: "test1@hotmail.com",
      password: "123456",
      password2: "123456",
      terms: true
    });
  }

  fieldsMatch(field1: string, field2: string) {
    return (group: FormGroup) => {
      let fieldGroup1 = group.controls[field1].value;
      let fieldGroup2 = group.controls[field2].value;
      if (fieldGroup1 === fieldGroup2) {
        return null;
      }
      return { fieldsMatch: true };
    };
  }

  register() {
    if (this.formRegister.invalid) return;

    if (!this.formRegister.value.terms) {
      Swal.fire({
        title: "Important",
        text: "Ops. You must agree to our Terms before being able to register.",
        type: "warning",
        confirmButtonText: "Ok"
      });
      return;
    }

    let user = new User(
      this.formRegister.value.name,
      this.formRegister.value.email,
      this.formRegister.value.password
    );

    this._userService
      .createUser(user)
      .subscribe(() => this.router.navigate(["/login"]));
  }
}
