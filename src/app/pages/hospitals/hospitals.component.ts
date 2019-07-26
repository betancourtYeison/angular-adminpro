import { Component, OnInit } from "@angular/core";
import {
  HospitalService,
  ModalUploadService
} from "src/app/services/service.index";
import { Hospital } from "../../models/hospital.model";
import Swal from "sweetalert2";

@Component({
  selector: "app-hospitals",
  templateUrl: "./hospitals.component.html",
  styles: []
})
export class HospitalsComponent implements OnInit {
  hospitals: Hospital[] = [];
  from: number = 0;
  hospitalsTotal: number = 0;
  loading: boolean = true;

  constructor(
    public _hospitalService: HospitalService,
    public _modalUpdloadServe: ModalUploadService
  ) {}

  ngOnInit() {
    this.loadHospitals();
    this._modalUpdloadServe.notification.subscribe((response: any) => {
      this.hospitals.map((hospital: Hospital) => {
        if (hospital._id === response.hospitals._id) {
          hospital.img = response.hospitals.img;
        }
        return hospital;
      });
    });
  }

  loadHospitals() {
    this.loading = true;
    this._hospitalService
      .loadHospitals(this.from)
      .subscribe((response: any) => {
        this.hospitalsTotal = response.total;
        this.hospitals = response.hospitals;
        this.loading = false;
      });
  }

  changeFrom(value: number) {
    let from = this.from + value;

    if (from >= this.hospitalsTotal) return;

    if (from < 0) return;

    this.from = from;
    this.loadHospitals();
  }

  searchHospital(search: string) {
    if (search.length <= 0) {
      this.loadHospitals();
      return;
    }

    this.loading = true;
    this._hospitalService
      .searchHospital(search)
      .subscribe((hospitals: Hospital[]) => {
        this.hospitalsTotal = hospitals.length;
        this.hospitals = hospitals;
        this.from = 0;
        this.loading = false;
      });
  }

  async createHospital() {
    const { value: name } = await Swal.fire({
      title: "Enter the new name for hospital",
      input: "text",
      inputValue: "",
      showCancelButton: true,
      inputValidator: value => {
        if (!value) {
          return "You need to write something!";
        }
      }
    });

    if (name) {
      let hospital = new Hospital(name);
      this._hospitalService.createHospital(hospital).subscribe(hospital => {
        if (this.hospitalsTotal < 5) {
          this.hospitals.push(hospital);
        }
        this.hospitalsTotal += 1;
      });
    }
  }

  updateHospital(hospital: Hospital) {
    this._hospitalService.updateHospital(hospital).subscribe();
  }

  deleteHospital(hospital: Hospital) {
    Swal.fire({
      title: "Are you sure?",
      text: "You will delete: " + hospital.name,
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Confirm!",
      confirmButtonColor: "#ef5350"
    }).then(result => {
      if (result.value) {
        this._hospitalService.deleteHospital(hospital._id).subscribe(() => {
          this.from = 0;
          this.loadHospitals();
        });
      }
    });
  }

  showModal(id: string) {
    this._modalUpdloadServe.showModal("hospitals", id);
  }
}
