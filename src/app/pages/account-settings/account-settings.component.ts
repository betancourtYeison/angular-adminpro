import { Component, OnInit, Inject } from "@angular/core";
import { SettingsService } from "../../services/service.index";

@Component({
  selector: "app-account-settings",
  templateUrl: "./account-settings.component.html",
  styles: []
})
export class AccountSettingsComponent implements OnInit {
  constructor(public _settings: SettingsService) {}

  ngOnInit() {
    this.updateCheck();
  }

  changeColor(color: string, link: any) {
    this.applyCheck(link);
    this._settings.applyTheme(color);
  }

  applyCheck(link) {
    let selectors: any = document.getElementsByClassName("selector");
    for (let ref of selectors) {
      ref.classList.remove("working");
    }
    link.classList.add("working");
  }

  updateCheck() {
    let selectors: any = document.getElementsByClassName("selector");
    let color = this._settings.settings.color;
    for (let ref of selectors) {
      if (ref.getAttribute("data-theme") === color) {
        ref.classList.add("working");
        break;
      }
    }
  }
}
