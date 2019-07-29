import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
import { URL_SERVICES } from "../../config/config";
import { Hospital } from "../../models/hospital.model";
import { UploadService } from "../upload/upload.service";
import Swal from "sweetalert2";

@Injectable({
  providedIn: "root"
})
export class HospitalService {
  hospital: Hospital;
  token: string;

  constructor(
    public _http: HttpClient,
    public router: Router,
    public _uploadService: UploadService
  ) {
    this.loadStorage();
  }

  loadStorage() {
    this.token = localStorage.getItem("token");
  }

  searchHospital(search: string) {
    let url = `${URL_SERVICES}/search/collection/hospitals/${search}`;
    return this._http.get(url).pipe(map((response: any) => response.hospitals));
  }

  loadHospital(id: string) {
    let url = `${URL_SERVICES}/hospital/${id}`;
    return this._http.get(url);
  }

  loadHospitals(from: number = 0) {
    let url = `${URL_SERVICES}/hospital?from=${from}`;
    return this._http.get(url);
  }

  createHospital(hospital: Hospital) {
    let url = `${URL_SERVICES}/hospital?token=${this.token}`;
    return this._http.post(url, hospital).pipe(
      map((response: any) => {
        Swal.fire({
          title: "Hospital created",
          text: hospital.name,
          type: "success"
        });
        return response.hospital;
      })
    );
  }

  updateHospital(hospital: Hospital) {
    let url = `${URL_SERVICES}/hospital/${hospital._id}?token=${this.token}`;
    return this._http.put(url, hospital).pipe(
      map((response: any) => {
        Swal.fire({
          title: "Hospital updated",
          text: hospital.name,
          type: "success"
        });
        return response.hospital;
      })
    );
  }

  deleteHospital(id: string) {
    let url = `${URL_SERVICES}/hospital/${id}?token=${this.token}`;
    return this._http.delete(url).pipe(
      map((response: any) => {
        Swal.fire("Deleted!", "Hospital has been deleted.", "success");
        return response.hospital;
      })
    );
  }

  changeImage(file: File, id: string) {
    this._uploadService
      .upload(file, "hospitals", id)
      .then((response: any) => {
        Swal.fire({
          title: "Image updated",
          text: this.hospital.name,
          type: "success"
        });

        this.hospital.img = response.hospitals.img;
      })
      .catch(err => {
        Swal.fire({
          title: err.message,
          text: err.errors.message,
          type: "error"
        });
      });
  }
}
