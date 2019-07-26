import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { PagesComponent } from "./pages.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { ProgressComponent } from "./progress/progress.component";
import { Graphics1Component } from "./graphics1/graphics1.component";
import { PromisesComponent } from "./promises/promises.component";
import { RxjsComponent } from "./rxjs/rxjs.component";
import { AccountSettingsComponent } from "./account-settings/account-settings.component";
import { ProfileComponent } from "./profile/profile.component";

import { LoginGuard } from "../services/service.index";
import { UsersComponent } from "./users/users.component";

const pagesRoutes: Routes = [
  {
    path: "",
    component: PagesComponent,
    canActivate: [LoginGuard],
    children: [
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
      // Maintenance
      {
        path: "users",
        component: UsersComponent,
        data: { title: "Users" }
      },
      { path: "", redirectTo: "/dashboard", pathMatch: "full" }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(pagesRoutes)],
  exports: [RouterModule]
})
export class PagesRoutingModule {}
