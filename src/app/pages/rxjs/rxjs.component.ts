import { Component, OnInit, OnDestroy } from "@angular/core";
import { Observable, Subscriber, Subscription } from "rxjs";
import { retry, map, filter } from "rxjs/operators";

@Component({
  selector: "app-rxjs",
  templateUrl: "./rxjs.component.html",
  styles: []
})
export class RxjsComponent implements OnInit, OnDestroy {
  subscription: Subscription;

  constructor() {
    this.subscription = this.returnObservable()
      // .pipe(retry(2))
      .subscribe(
        data => console.log("Subs", data),
        error => console.error("Error:", error),
        () => console.log("Obs end")
      );
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  returnObservable(): Observable<any> {
    return new Observable((observer: Subscriber<any>) => {
      let counter = 0;
      let interval = setInterval(() => {
        counter++;
        const response = {
          value: counter
        };
        observer.next(response);
        // if (counter === 3) {
        //   clearInterval(interval);
        //   observer.complete();
        // }
        // if (counter === 2) {
        //   clearInterval(interval);
        //   observer.error("Fail!!!");
        // }
      }, 1000);
    }).pipe(
      map(obj => obj.value),
      filter(obj => obj % 2 === 0)
    );
  }
}
