import { Component, OnInit } from "@angular/core";
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";

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
  user = {
    skills: [
      { name: "Aphids DSS 1", selected: false, id: 1, val: "Aphids DSS 1" },
      { name: "Aphids DSS 2", selected: false, id: 2, val: "Aphids DSS 2" },
    ],
  };

  chkPestList: any[] = [];
  dssSelectionForm: FormGroup;
  cropSearch: FormControl = new FormControl();
  pestSearch: FormControl = new FormControl();

  parameters = new FormArray([]);
  cropsArray = new FormArray([]);
  dss = new FormArray([]);

  // dropdowns
  crops: { value: string; label: string }[] = [];
  cropParameters: { value: string; label: string }[] = [];
  // end dropdowns
  tblCropPestCombinations: { crop: string; pest: string; dss: string }[];

  cropTitle: string = "Wheat, Cabbage";
  cropTitle2: string = "Cabbage, Apple, Carrot";
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

  constructor(private _fb: FormBuilder) {}

  ngOnInit() {
    this.initDssSelectionForm();

    this.crops = [
      { value: "Wheat", label: "Wheat" },
      { value: "Cabbage", label: "Cabbage" },
      { value: "Apple", label: "Apple" },
      { value: "Carrot", label: "Carrot" },
    ];

    this.cropParameters = [
      { value: "temperature", label: "Temperature" },
      { value: "aphid_count", label: "Aphid count" },
      { value: "Humidity", label: "Humidity" },
    ];

    this.tblCropPestCombinations = [
      { crop: "Wheat", pest: "Aphids", dss: "Aphids DSS1" },
      // { crop: "Cabbage", pest: "Cabbage moth", dss: "VIPS, Cabbage moth model" },
    ];

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

  initDssSelectionForm() {
    this.dssSelectionForm = this._fb.group({
      skills: this.buildSkills(),
      // dss: this._fb.array([this.createPropertie()]),
      cropsArray: this._fb.array([this.createPropertie()]),
      parameters: this._fb.array([this.createPropertie()]),
    });
  }

  get f() {
    return this.dssSelectionForm.controls;
  }

  get skills() {
    return this.dssSelectionForm.get("skills");
  }

  buildSkills() {
    const arr = this.user.skills.map((item) => {
      return this._fb.control(item.selected);
    });
    return this._fb.array(arr);
  }

  addCrop(): void {
    this.cropsArray = this.dssSelectionForm.get("cropsArray") as FormArray;
    this.cropsArray.push(this.createPropertie());
  }

  addParameter(): void {
    this.parameters = this.dssSelectionForm.get("parameters") as FormArray;
    this.parameters.push(this.createPropertie());
  }

  private createPropertie(): FormControl {
    return this._fb.control("", Validators.required);
  }

  onAddCombinationToTable(value) {
    console.log("formmmmmmmmm", this.dssSelectionForm.value);
    const formValues = this.dssSelectionForm.value;

    const dssArr = formValues.skills;
    const len = dssArr.length;

    console.log("dddd", value);
    const formValue = Object.assign(
      {},
      {
        skills: value.skills.map((selected, i) => {
          return {
            id: this.user.skills[i].id,
            selected,
          };
        }),
      }
    );

    console.log("formddasffd", formValue);

    for (let i = 0; i < len; i++) {
      if (dssArr[i] === true) {
        let dssVal = this.user.skills[i].val;
        let cropPestCombinationRow = {
          crop: this.cropSearch.value,
          pest: this.pestSearch.value,
          dss: dssVal,
        };
        this.tblCropPestCombinations.push(cropPestCombinationRow);
      }
    }
  }
}

interface CropPest {
  crop: string;
  parameters: string[];
}
