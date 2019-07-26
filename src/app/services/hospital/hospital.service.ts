import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { HttpClient, HttpHeaders } from "@angular/common/http";
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
    let headers = new HttpHeaders({
      "Content-Type": "application/json"
    });
    return this._http
      .get(url, { headers })
      .pipe(map((response: any) => response.hospitals));
  }

  loadHospital(id: string) {
    let url = `${URL_SERVICES}/hospital/${id}`;
    let headers = new HttpHeaders({
      "Content-Type": "application/json"
    });
    return this._http.get(url, { headers });
  }

  loadHospitals(from: number = 0) {
    let url = `${URL_SERVICES}/hospital?from=${from}`;
    let headers = new HttpHeaders({
      "Content-Type": "application/json"
    });
    return this._http.get(url, { headers });
  }

  createHospital(hospital: Hospital) {
    let url = `${URL_SERVICES}/hospital?token=${this.token}`;
    let headers = new HttpHeaders({
      "Content-Type": "application/json"
    });
    return this._http.post(url, hospital, { headers }).pipe(
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
    let headers = new HttpHeaders({
      "Content-Type": "application/json"
    });
    return this._http.put(url, hospital, { headers }).pipe(
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
    let headers = new HttpHeaders({
      "Content-Type": "application/json"
    });

    return this._http.delete(url, { headers }).pipe(
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
      .catch(err => console.log(err));
  }
}
