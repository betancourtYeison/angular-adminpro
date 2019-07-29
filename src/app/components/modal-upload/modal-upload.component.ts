import { Component, OnInit } from "@angular/core";
import {
  UploadService,
  ModalUploadService
} from "../../services/service.index";
import Swal from "sweetalert2";

@Component({
  selector: "app-modal-upload",
  templateUrl: "./modal-upload.component.html",
  styles: []
})
export class ModalUploadComponent implements OnInit {
  image: File;
  imageTmp: string;

  constructor(
    public _uploadService: UploadService,
    public _modalUploadService: ModalUploadService
  ) {}

  ngOnInit() {}

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
    this._uploadService
      .upload(
        this.image,
        this._modalUploadService.type,
        this._modalUploadService.id
      )
      .then(response => {
        Swal.fire({
          title: "Image updated",
          text: "The image was updated",
          type: "success"
        });
        this._modalUploadService.notification.emit(response);
        this.hideModal();
      })
      .catch(err => {
        Swal.fire({
          title: err.message,
          text: err.errors.message,
          type: "error"
        });
        this.hideModal();
      });
  }

  hideModal() {
    this.image = null;
    this.imageTmp = null;
    this._modalUploadService.hideModal();
  }
}
