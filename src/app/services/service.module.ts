import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";

import {
  SettingsService,
  SharedService,
  SidebarService,
  UserService,
  HospitalService,
  DoctorService,
  UploadService,
  ModalUploadService,
  LoginGuard
} from "./service.index";

@NgModule({
  declarations: [],
  imports: [CommonModule, HttpClientModule],
  providers: [
    SettingsService,
    SharedService,
    SidebarService,
    UserService,
    HospitalService,
    DoctorService,
    UploadService,
    ModalUploadService,
    LoginGuard
  ]
})
export class ServiceModule {}
