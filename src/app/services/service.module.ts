import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";

import { InterceptorService } from "../interceptors/interceptor.service";

import {
  SettingsService,
  SharedService,
  SidebarService,
  UserService,
  HospitalService,
  DoctorService,
  UploadService,
  ModalUploadService,
  LoginGuard,
  AdminGuard,
  VerifyTokenGuard
} from "./service.index";

@NgModule({
  declarations: [],
  imports: [CommonModule, HttpClientModule],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptorService,
      multi: true
    },
    SettingsService,
    SharedService,
    SidebarService,
    UserService,
    HospitalService,
    DoctorService,
    UploadService,
    ModalUploadService,
    LoginGuard,
    AdminGuard,
    VerifyTokenGuard
  ]
})
export class ServiceModule {}
