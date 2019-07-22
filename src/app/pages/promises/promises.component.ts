import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-promises",
  templateUrl: "./promises.component.html",
  styles: []
})
export class PromisesComponent implements OnInit {
  constructor() {
    this.countThree()
      .then(message => console.log("End", message))
      .catch(error => console.log(error));
  }

  ngOnInit() {}

  countThree(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      let counter = 0;
      let inteval = setInterval(() => {
        counter++;
        if (counter === 3) {
          resolve(true);
          clearInterval(inteval);
        }
        console.log(counter);
      }, 1000);
    });
  }
}
