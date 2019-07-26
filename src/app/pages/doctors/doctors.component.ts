import { Component, OnInit } from "@angular/core";
import {
  DoctorService,
  ModalUploadService
} from "src/app/services/service.index";
import { Doctor } from "../../models/doctor.model";
import Swal from "sweetalert2";

@Component({
  selector: "app-doctors",
  templateUrl: "./doctors.component.html",
  styles: []
})
export class DoctorsComponent implements OnInit {
  doctors: Doctor[] = [];
  from: number = 0;
  doctorsTotal: number = 0;
  loading: boolean = true;

  constructor(
    public _doctorService: DoctorService,
    public _modalUpdloadServe: ModalUploadService
  ) {}

  ngOnInit() {
    this.loadDoctors();
    this._modalUpdloadServe.notification.subscribe((response: any) => {
      this.doctors.map((doctor: Doctor) => {
        if (doctor._id === response.doctors._id) {
          doctor.img = response.doctors.img;
        }
        return doctor;
      });
    });
  }

  loadDoctors() {
    this.loading = true;
    this._doctorService.loadDoctors(this.from).subscribe((response: any) => {
      this.doctorsTotal = response.total;
      this.doctors = response.doctors;
      this.loading = false;
    });
  }

  changeFrom(value: number) {
    let from = this.from + value;

    if (from >= this.doctorsTotal) return;

    if (from < 0) return;

    this.from = from;
    this.loadDoctors();
  }

  searchDoctor(search: string) {
    if (search.length <= 0) {
      this.loadDoctors();
      return;
    }

    this.loading = true;
    this._doctorService.searchDoctor(search).subscribe((doctors: Doctor[]) => {
      this.doctorsTotal = doctors.length;
      this.doctors = doctors;
      this.from = 0;
      this.loading = false;
    });
  }

  deleteDoctor(doctor: Doctor) {
    Swal.fire({
      title: "Are you sure?",
      text: "You will delete: " + doctor.name,
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Confirm!",
      confirmButtonColor: "#ef5350"
    }).then(result => {
      if (result.value) {
        this._doctorService.deleteDoctor(doctor._id).subscribe(() => {
          this.from = 0;
          this.loadDoctors();
        });
      }
    });
  }

  showModal(id: string) {
    this._modalUpdloadServe.showModal("doctors", id);
  }
}
