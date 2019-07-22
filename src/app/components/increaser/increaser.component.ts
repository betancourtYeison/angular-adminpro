import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef
} from "@angular/core";

@Component({
  selector: "app-increaser",
  templateUrl: "./increaser.component.html",
  styles: []
})
export class IncreaserComponent implements OnInit {
  @ViewChild("txtPercentage") txtPercentage: ElementRef;

  @Input() legend: string = "Leyenda";
  @Input() percentage: number = 50;

  @Output() updateValue: EventEmitter<number> = new EventEmitter();

  constructor() {}

  ngOnInit() {}

  onChange(newValue: number) {
    if (newValue >= 100) {
      this.percentage = 100;
    } else if (newValue <= 0) {
      this.percentage = 0;
    } else {
      this.percentage = newValue;
    }
    this.txtPercentage.nativeElement.value = this.percentage;
    this.updateValue.emit(this.percentage);
  }

  changeValue(value: number) {
    let newValue = this.percentage + value;
    if (newValue > 100 || newValue < 0) return;
    this.percentage = newValue;
    this.updateValue.emit(this.percentage);
    this.txtPercentage.nativeElement.focus();
  }
}
