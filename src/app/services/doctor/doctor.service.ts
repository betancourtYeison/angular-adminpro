import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
import { URL_SERVICES } from "../../config/config";
import { Doctor } from "../../models/doctor.model";
import { UploadService } from "../upload/upload.service";
import Swal from "sweetalert2";

@Injectable({
  providedIn: "root"
})
export class DoctorService {
  doctor: Doctor;
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

  searchDoctor(search: string) {
    let url = `${URL_SERVICES}/search/collection/doctors/${search}`;
    return this._http.get(url).pipe(map((response: any) => response.doctors));
  }

  loadDoctor(id: string) {
    let url = `${URL_SERVICES}/doctor/${id}`;
    return this._http.get(url);
  }

  loadDoctors(from: number = 0) {
    let url = `${URL_SERVICES}/doctor?from=${from}`;
    return this._http.get(url);
  }

  createDoctor(doctor: Doctor) {
    let url = `${URL_SERVICES}/doctor?token=${this.token}`;
    return this._http.post(url, doctor).pipe(
      map((response: any) => {
        Swal.fire({
          title: "Doctor created",
          text: doctor.name,
          type: "success"
        });
        return response.doctor;
      })
    );
  }

  updateDoctor(doctor: Doctor) {
    let url = `${URL_SERVICES}/doctor/${doctor._id}?token=${this.token}`;
    return this._http.put(url, doctor).pipe(
      map((response: any) => {
        Swal.fire({
          title: "Doctor updated",
          text: doctor.name,
          type: "success"
        });
        return response.doctor;
      })
    );
  }

  deleteDoctor(id: string) {
    let url = `${URL_SERVICES}/doctor/${id}?token=${this.token}`;
    return this._http.delete(url).pipe(
      map((response: any) => {
        Swal.fire("Deleted!", "Doctor has been deleted.", "success");
        return response.doctor;
      })
    );
  }

  changeImage(file: File, id: string) {
    this._uploadService
      .upload(file, "doctors", id)
      .then((response: any) => {
        Swal.fire({
          title: "Image updated",
          text: this.doctor.name,
          type: "success"
        });

        this.doctor.img = response.doctors.img;
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
