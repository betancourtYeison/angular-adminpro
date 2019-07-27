import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { map } from "rxjs/operators";
import { URL_SERVICES } from "../../config/config";
import { User } from "../../models/user.model";
import { Hospital } from "../../models/hospital.model";
import { Doctor } from "../../models/doctor.model";
import { UserService } from "src/app/services/service.index";

@Component({
  selector: "app-search",
  templateUrl: "./search.component.html",
  styles: []
})
export class SearchComponent implements OnInit {
  users: User[] = [];
  hospitals: Hospital[] = [];
  doctors: Doctor[] = [];

  constructor(
    public activatedRouter: ActivatedRoute,
    public _userService: UserService,
    public _http: HttpClient
  ) {
    activatedRouter.params.subscribe(params => {
      let term = params["term"];
      this.search(term);
    });
  }

  ngOnInit() {}

  search(term: string) {
    let url = `${URL_SERVICES}/search/all/${term}`;
    let headers = new HttpHeaders({
      "Content-Type": "application/json"
    });
    this._http.get(url, { headers }).subscribe((response: any) => {
      this.users = response.users;
      this.hospitals = response.hospitals;
      this.doctors = response.doctors;
    });
  }
}
