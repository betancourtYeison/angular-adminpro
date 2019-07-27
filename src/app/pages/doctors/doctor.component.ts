import { Component, OnInit } from "@angular/core";
import {
  DoctorService,
  HospitalService,
  ModalUploadService
} from "src/app/services/service.index";
import { Doctor } from "../../models/doctor.model";
import { Hospital } from "../../models/hospital.model";
import { Router, ActivatedRoute } from "@angular/router";
import { NgForm } from "@angular/forms";

@Component({
  selector: "app-doctor",
  templateUrl: "./doctor.component.html",
  styles: []
})
export class DoctorComponent implements OnInit {
  doctor: Doctor = new Doctor("", "", "", "", "");
  hospitals: Hospital[] = [];
  hospital: Hospital = new Hospital("");

  constructor(
    public _doctorService: DoctorService,
    public _hospitalService: HospitalService,
    public _modalUpdloadServe: ModalUploadService,
    public router: Router,
    public activatedRoute: ActivatedRoute
  ) {
    activatedRoute.params.subscribe(params => {
      let id = params["id"];
      if (id !== "new") {
        this.loadDoctor(id);
      }
    });
  }

  ngOnInit() {
    this._hospitalService
      .loadHospitals()
      .subscribe((response: any) => (this.hospitals = response.hospitals));

    this._modalUpdloadServe.notification.subscribe((response: any) => {
      this.doctor.img = response.doctors.img;
    });
  }

  loadDoctor(id: string) {
    this._doctorService.loadDoctor(id).subscribe((response: any) => {
      this.doctor = response.doctor;
      this.doctor.hospital = response.doctor.hospital._id;
      this.changeHospital(this.doctor.hospital);
    });
  }

  saveDoctor(formDoctor: NgForm) {
    if (formDoctor.invalid) return;
    if (this.doctor._id) {
      this.updateDoctor(this.doctor);
    } else {
      this.createDoctor(this.doctor);
    }
  }

  createDoctor(doctor: Doctor) {
    this._doctorService.createDoctor(doctor).subscribe(response => {
      doctor._id = response._id;
      this.router.navigate(["/doctor", doctor._id]);
    });
  }

  updateDoctor(doctor: Doctor) {
    this._doctorService.updateDoctor(doctor).subscribe();
  }

  changeHospital(id: string) {
    this._hospitalService
      .loadHospital(id)
      .subscribe((response: any) => (this.hospital = response.hospital));
  }

  showModal(id: string) {
    this._modalUpdloadServe.showModal("doctors", id);
  }
}
