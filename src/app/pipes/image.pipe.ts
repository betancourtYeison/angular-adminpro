import { Pipe, PipeTransform } from "@angular/core";
import { URL_SERVICES } from "../config/config";

@Pipe({
  name: "image"
})
export class ImagePipe implements PipeTransform {
  transform(img: string, type: string = "users"): any {
    let url = `${URL_SERVICES}/images`;

    if (!img) {
      return `${url}/users/xxx`;
    }

    if (img.indexOf("https") >= 0) {
      return img;
    }

    switch (type) {
      case "hospitals":
        url = `${url}/hospitals/${img}`;
        break;
      case "doctors":
        url = `${url}/doctors/${img}`;
        break;
      case "users":
        url = `${url}/users/${img}`;
        break;
      default:
        url = `${url}/users/xxx`;
        break;
    }

    return url;
  }
}
