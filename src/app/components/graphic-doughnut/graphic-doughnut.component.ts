import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "app-graphic-doughnut",
  templateUrl: "./graphic-doughnut.component.html",
  styles: []
})
export class GraphicDoughnutComponent implements OnInit {
  @Input() legend: string = "Leyenda";
  @Input() doughnutChartLabels: string[] = [
    "Download Sales",
    "In-Store Sales",
    "Mail-Order Sales"
  ];
  @Input() doughnutChartData: number[] = [350, 450, 100];
  @Input() doughnutChartType: string = "doughnut";

  constructor() {}

  ngOnInit() {}
}
