import { NgModule } from "@angular/core";

import { CommonModule } from "@angular/common";
import { SharedModule } from "../shared/shared.module";
import { FormsModule } from "@angular/forms";
import { PagesRoutingModule } from "./pages-routing.module";

import { ChartsModule } from "ng2-charts";

import { PipesModule } from "../pipes/pipes.module";

import { PagesComponent } from "./pages.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { ProgressComponent } from "./progress/progress.component";
import { Graphics1Component } from "./graphics1/graphics1.component";
import { PromisesComponent } from "./promises/promises.component";
import { RxjsComponent } from "./rxjs/rxjs.component";
import { AccountSettingsComponent } from "./account-settings/account-settings.component";
import { ProfileComponent } from "./profile/profile.component";

import { IncreaserComponent } from "../components/increaser/increaser.component";
import { GraphicDoughnutComponent } from "../components/graphic-doughnut/graphic-doughnut.component";

@NgModule({
  declarations: [
    PagesComponent,
    DashboardComponent,
    ProgressComponent,
    Graphics1Component,
    PromisesComponent,
    RxjsComponent,
    AccountSettingsComponent,
    ProfileComponent,
    IncreaserComponent,
    GraphicDoughnutComponent
  ],
  exports: [
    PagesComponent,
    DashboardComponent,
    ProgressComponent,
    Graphics1Component
  ],
  imports: [
    CommonModule,
    SharedModule,
    PagesRoutingModule,
    FormsModule,
    ChartsModule,
    PipesModule
  ]
})
export class PagesModule {}
