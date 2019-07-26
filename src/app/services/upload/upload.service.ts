import { Injectable } from "@angular/core";
import { URL_SERVICES } from "../../config/config";

@Injectable({
  providedIn: "root"
})
export class UploadService {
  constructor() {}

  upload(file: File, type: string, id: string) {
    return new Promise((resolve, reject) => {
      let formData = new FormData();
      let xhr = new XMLHttpRequest();
      let url = `${URL_SERVICES}/upload/${type}/${id}`;

      formData.append("img", file, file.name);

      xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            resolve(JSON.parse(xhr.response));
          } else {
            reject(JSON.parse(xhr.response));
          }
        }
      };

      xhr.open("PUT", url, true);
      xhr.send(formData);
    });
  }
}
