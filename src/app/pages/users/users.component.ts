import { Component, OnInit } from "@angular/core";
import { User } from "src/app/models/user.model";
import {
  UserService,
  ModalUploadService
} from "src/app/services/service.index";
import { ActivatedRoute } from "@angular/router";
import Swal from "sweetalert2";

@Component({
  selector: "app-users",
  templateUrl: "./users.component.html",
  styles: []
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  from: number = 0;
  usersTotal: number = 0;
  loading: boolean = true;

  constructor(
    public _userService: UserService,
    public _modalUpdloadServe: ModalUploadService,
    public activatedRouter: ActivatedRoute
  ) {}

  ngOnInit() {
    this.activatedRouter.params.subscribe(params => {
      let id = params["id"];
      if (id === "all") {
        this.loadUsers();
      } else {
        this.searchUser(id);
      }
    });
    this._modalUpdloadServe.notification.subscribe((response: any) => {
      this.users.map((user: User) => {
        if (user._id === response.users._id) {
          user.img = response.users.img;
        }
        return user;
      });
    });
  }

  loadUsers() {
    this.loading = true;
    this._userService.loadUsers(this.from).subscribe((response: any) => {
      this.usersTotal = response.total;
      this.users = response.users;
      this.loading = false;
    });
  }

  changeFrom(value: number) {
    let from = this.from + value;

    if (from >= this.usersTotal) return;

    if (from < 0) return;

    this.from = from;
    this.loadUsers();
  }

  searchUser(search: string) {
    if (search.length <= 0) {
      this.loadUsers();
      return;
    }

    this.loading = true;
    this._userService.searchUser(search).subscribe((users: User[]) => {
      this.usersTotal = users.length;
      this.users = users;
      this.from = 0;
      this.loading = false;
    });
  }

  updateUser(user: User) {
    this._userService.updateUser(user).subscribe();
  }

  deleteUser(user: User) {
    if (user._id === this._userService.user._id) {
      Swal.fire({
        title: "Error",
        text: "Cannot delete logged in user",
        type: "error"
      });
      return;
    }

    Swal.fire({
      title: "Are you sure?",
      text: "You will delete: " + user.email,
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Confirm!",
      confirmButtonColor: "#ef5350"
    }).then(result => {
      if (result.value) {
        this._userService.deleteUser(user._id).subscribe(() => {
          this.from = 0;
          this.loadUsers();
        });
      }
    });
  }

  showModal(id: string) {
    this._modalUpdloadServe.showModal("users", id);
  }
}
