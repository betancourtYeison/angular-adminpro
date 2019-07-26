import { Component, OnInit } from "@angular/core";
import { UserService } from "../../services/user/user.service";
import { User } from "../../models/user.model";
import Swal from "sweetalert2";

@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styles: []
})
export class ProfileComponent implements OnInit {
  user: User;

  image: File;
  imageTmp: string;

  constructor(public _userService: UserService) {}

  ngOnInit() {
    this.user = this._userService.user;
  }

  save(user: User) {
    this.user.name = user.name;
    if (!this.user.google) {
      this.user.email = user.email;
    }
    this._userService.updateUser(this.user).subscribe();
  }

  selectImage(file) {
    if (!file) {
      this.image = null;
      return;
    }

    if (file.type.indexOf("image") < 0) {
      Swal.fire({
        title: "Important!",
        text: "File is not an image",
        type: "error"
      });
      this.image = null;
      return;
    }

    this.image = file;

    let reader = new FileReader();
    let urlImageTmp = reader.readAsDataURL(file);
    reader.onloadend = () => (this.imageTmp = String(reader.result));
  }

  upload() {
    this._userService.changeImage(this.image, this.user._id);
  }
}
