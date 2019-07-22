import { Injectable, Inject } from "@angular/core";
import { DOCUMENT } from "@angular/platform-browser";

@Injectable({
  providedIn: "root"
})
export class SettingsService {
  settings: Settings = {
    themeUrl: "assets/css/colors/default-dark.css",
    color: "default-dark"
  };

  constructor(@Inject(DOCUMENT) private _document) {
    this.loadSettings();
  }

  saveSettings(newSettings: Settings) {
    this.settings = newSettings;
    localStorage.setItem("settings", JSON.stringify(this.settings));
  }

  loadSettings() {
    if (localStorage.getItem("settings")) {
      this.settings = JSON.parse(localStorage.getItem("settings"));
    }
    this.applyTheme(this.settings.color);
  }

  applyTheme(color: string) {
    let url = `assets/css/colors/${color}.css`;
    this._document.getElementById("theme").setAttribute("href", url);
    this.saveSettings({
      themeUrl: url,
      color: color
    });
  }
}

interface Settings {
  themeUrl: string;
  color: string;
}
