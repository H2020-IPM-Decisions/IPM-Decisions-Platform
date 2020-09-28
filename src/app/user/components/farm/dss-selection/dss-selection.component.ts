import { Component, OnInit } from "@angular/core";

export interface exam {
  key?: any[];
  name: string;
  units: string;
  desc: string;
  inout: string;
}
@Component({
  selector: "app-dss-selection",
  templateUrl: "./dss-selection.component.html",
  styleUrls: ["./dss-selection.component.css"],
})
export class DssSelectionComponent implements OnInit {
  chkPestList: any[] = [];

  pestTitle: string = "Aphid 1 information";
  pestTitle2: string = "Aphid 2 information";
  pestTableContent: string = `<table class="table table-sm table-responsive table-bordered">
  <tr><th>Name</th><th>Units</th><th>Description</th><th>Input/Output</th></tr>
  <tr>
  <td>Temperature</td>  <td>degree</td>  <td>Average dolly temperature</td>  <td>input</td>
  </tr>
  <tr>
  <td>Aphid co</td>  <td>Number per</td>  <td>Number of aphids</td>  <td>output</td>
  </tr>
  </table>`;

  pestTableContent2: string = `<table class="table table-sm table-responsive table-bordered">
  <tr><th>Name</th><th>Units</th><th>Description</th><th>Input/Output</th></tr>
  <tr>
  <td>Temperature</td>  <td>degree</td>  <td>Average dolly temperature</td>  <td>input</td>
  </tr>
  <tr>
  <td>Aphid 2 co</td>  <td>Number per</td>  <td>Number of aphids</td>  <td>output</td>
  </tr>
  </table>`;

  constructor() {}

  ngOnInit() {
    this.chkPestList[0] = [
      {
        pest: "Astoria  1",
        name: "Temperature",
        units: "degree",
        desc: "Average dolly temperature",
        inout: "input",
      },
      {
        name: "Aphid co",
        units: "Number per",
        desc: "Number of aphids",
        inout: "output",
      },
    ];

    this.chkPestList[1] = [
      {
        pest: "Astoria2",
        name: "Temperature2",
        units: "degree2",
        desc: "Average dolly temperature",
        inout: "input",
      },
      {
        name: "Aphid 2 co",
        units: "Number per 2",
        desc: "Number of aphids",
        inout: "output",
      },
    ];
  }
}
