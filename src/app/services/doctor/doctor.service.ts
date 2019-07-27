import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { throwError } from "rxjs";
import { map, catchError } from "rxjs/operators";
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
    let headers = new HttpHeaders({
      "Content-Type": "application/json"
    });
    return this._http
      .get(url, { headers })
      .pipe(map((response: any) => response.doctors));
  }

  loadDoctor(id: string) {
    let url = `${URL_SERVICES}/doctor/${id}`;
    let headers = new HttpHeaders({
      "Content-Type": "application/json"
    });
    return this._http.get(url, { headers });
  }

  loadDoctors(from: number = 0) {
    let url = `${URL_SERVICES}/doctor?from=${from}`;
    let headers = new HttpHeaders({
      "Content-Type": "application/json"
    });
    return this._http.get(url, { headers });
  }

  createDoctor(doctor: Doctor) {
    let url = `${URL_SERVICES}/doctor?token=${this.token}`;
    let headers = new HttpHeaders({
      "Content-Type": "application/json"
    });
    return this._http.post(url, doctor, { headers }).pipe(
      map((response: any) => {
        Swal.fire({
          title: "Doctor created",
          text: doctor.name,
          type: "success"
        });
        return response.doctor;
      }),
      catchError(err => {
        Swal.fire({
          title: err.error.message,
          text: err.error.errors.message,
          type: "error"
        });
        return throwError(err);
      })
    );
  }

  updateDoctor(doctor: Doctor) {
    let url = `${URL_SERVICES}/doctor/${doctor._id}?token=${this.token}`;
    let headers = new HttpHeaders({
      "Content-Type": "application/json"
    });
    return this._http.put(url, doctor, { headers }).pipe(
      map((response: any) => {
        Swal.fire({
          title: "Doctor updated",
          text: doctor.name,
          type: "success"
        });
        return response.doctor;
      }),
      catchError(err => {
        Swal.fire({
          title: err.error.message,
          text: err.error.errors.message,
          type: "error"
        });
        return throwError(err);
      })
    );
  }

  deleteDoctor(id: string) {
    let url = `${URL_SERVICES}/doctor/${id}?token=${this.token}`;
    let headers = new HttpHeaders({
      "Content-Type": "application/json"
    });

    return this._http.delete(url, { headers }).pipe(
      map((response: any) => {
        Swal.fire("Deleted!", "Doctor has been deleted.", "success");
        return response.doctor;
      }),
      catchError(err => {
        Swal.fire({
          title: err.error.message,
          text: err.error.errors.message,
          type: "error"
        });
        return throwError(err);
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
