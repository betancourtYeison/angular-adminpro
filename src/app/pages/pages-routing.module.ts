import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { AdminGuard, VerifyTokenGuard } from "../services/service.index";

import { DashboardComponent } from "./dashboard/dashboard.component";
import { ProgressComponent } from "./progress/progress.component";
import { Graphics1Component } from "./graphics1/graphics1.component";
import { PromisesComponent } from "./promises/promises.component";
import { RxjsComponent } from "./rxjs/rxjs.component";
import { AccountSettingsComponent } from "./account-settings/account-settings.component";
import { ProfileComponent } from "./profile/profile.component";
import { SearchComponent } from "./search/search.component";
import { UsersComponent } from "./users/users.component";
import { HospitalsComponent } from "./hospitals/hospitals.component";
import { DoctorsComponent } from "./doctors/doctors.component";
import { DoctorComponent } from "./doctors/doctor.component";

const pagesRoutes: Routes = [
  // Main
  {
    path: "dashboard",
    component: DashboardComponent,
    data: { title: "Dasboard" }
  },
  {
    path: "progress",
    component: ProgressComponent,
    data: { title: "Progress" }
  },
  {
    path: "graphics1",
    component: Graphics1Component,
    data: { title: "Graphics" }
  },
  {
    path: "promises",
    component: PromisesComponent,
    data: { title: "Promises" }
  },
  { path: "rxjs", component: RxjsComponent, data: { title: "RxJS" } },
  {
    path: "account-settings",
    component: AccountSettingsComponent,
    data: { title: "Account Settings" }
  },
  {
    path: "profile",
    component: ProfileComponent,
    data: { title: "Profile" }
  },
  {
    path: "search/:term",
    component: SearchComponent,
    data: { title: "Search" }
  },
  // Maintenance
  {
    canActivate: [AdminGuard, VerifyTokenGuard],
    path: "users/:id",
    component: UsersComponent,
    data: { title: "Maintenance Users" }
  },
  {
    path: "hospitals/:id",
    component: HospitalsComponent,
    data: { title: "Maintenance Hospitals" }
  },
  {
    path: "doctors",
    component: DoctorsComponent,
    data: { title: "Maintenance Doctors" }
  },
  {
    path: "doctor/:id",
    component: DoctorComponent,
    data: { title: "Doctor" }
  },
  { path: "", redirectTo: "/dashboard", pathMatch: "full" }
];

@NgModule({
  imports: [RouterModule.forChild(pagesRoutes)],
  exports: [RouterModule]
})
export class PagesRoutingModule {}
