import { NgModule } from "@angular/core";

import { SharedModule } from "../shared/shared.module";
import { FormsModule } from "@angular/forms";
import { PagesRoutingModule } from "./pages-routing.module";

import { ChartsModule } from "ng2-charts";

import { PagesComponent } from "./pages.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { ProgressComponent } from "./progress/progress.component";
import { Graphics1Component } from "./graphics1/graphics1.component";
import { AccountSettingsComponent } from "./account-settings/account-settings.component";

import { IncreaserComponent } from "../components/increaser/increaser.component";
import { GraphicDoughnutComponent } from "../components/graphic-doughnut/graphic-doughnut.component";
import { PromisesComponent } from './promises/promises.component';
import { RxjsComponent } from './rxjs/rxjs.component';

@NgModule({
  declarations: [
    PagesComponent,
    DashboardComponent,
    ProgressComponent,
    Graphics1Component,
    AccountSettingsComponent,
    IncreaserComponent,
    GraphicDoughnutComponent,
    PromisesComponent,
    RxjsComponent
  ],
  exports: [
    PagesComponent,
    DashboardComponent,
    ProgressComponent,
    Graphics1Component
  ],
  imports: [SharedModule, PagesRoutingModule, FormsModule, ChartsModule]
})
export class PagesModule {}
