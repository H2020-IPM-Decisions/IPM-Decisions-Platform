import { HttpErrorResponse, HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators, FormArray } from "@angular/forms";
import { FarmService } from "@app/shared/services/upr/farm.service";
import { FieldService } from "@app/shared/services/upr/field.service";
import { compare } from "fast-json-patch";
import { ToastrService } from "ngx-toastr";
import { environment } from './../../../../../environments/environment';

@Component({
  selector: "app-field-edit",
  templateUrl: "./field-edit.component.html",
  styleUrls: ["./field-edit.component.css"],
})
export class FieldEditComponent implements OnInit {
  fieldForm: FormGroup;
  cropPests: FormArray;
  farmName: string;
  formFieldValues;
  currentField: any;
  crops: { value: string; label: string }[] = [];
  pests: { value: string; label: string }[] = [];
  pestId = "";
  constructor(
    private _fb: FormBuilder,
    private _toastr: ToastrService,
    private _farmService: FarmService,
    private _fieldService: FieldService,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.fieldFormInit();
    this.http
      .get(`${environment.apiUrl}/api/dss/rest/crop`)
      .subscribe((response: any[]) => {
        this.crops = response.map((item) => ({ value: item, label: item }))
      })

    this.http
      .get(`${environment.apiUrl}/api/dss/rest/pest`)
      .subscribe((response: any[]) => {
        this.pests = response.map((item) => ({ value: item, label: item }))
      })
    this._farmService.currentFarm.subscribe(
      (farm) => (this.farmName = farm.name)
    );
    this._fieldService.currentField.subscribe((field: any) => {
      console.log("FIELD CURRENT 2 ", field);

      this.currentField = field;
      // fill form
      this.setFormValues(field);

      //store current form values
      this.formFieldValues = this.fieldForm.value;
      console.log(this.formFieldValues);
    });
  }

  fieldFormInit() {
    this.fieldForm = this._fb.group({
      cropPests: this.createCropPest(),
      name: ["", Validators.required], //field name
      inf1: ["", Validators.required], //variety
      inf2: ["", Validators.required], //sowing date
    });
  }

  createCropPest(): FormGroup {
    return this._fb.group({
      cropEppoCode: [{value: "", disabled: true}, Validators.required],
      pestEppoCode: ["", Validators.required],
    });
  }

  setFormValues(field: any) {
    this.fieldForm.patchValue({
      cropPests: {
        cropEppoCode: field.fieldCropDto.cropEppoCode,
        pestEppoCode: field.fieldCropDto.fieldCropPestDto.value[0].pestEppoCode
      },
      name: field.name,
      inf1: field.inf1,
      inf2: this.formatLocaleDateGB(field.inf2),
    });
    this.pestId = field.fieldCropDto.fieldCropPestDto.value[0].id;
  }

  //todo: helper
  private formatLocaleDateGB(unformatedDate: string) {
    return new Date(unformatedDate).toLocaleDateString("en-GB");
  }

  addCropPestRow(): void {
    this.cropPests = this.fieldForm.get("cropPests") as FormArray;
    this.cropPests.push(this.createCropPest());
  }

  onEditFieldSubmit() {
    const updatedFieldValues = this.fieldForm.value;
    const patch = compare(this.formFieldValues, updatedFieldValues);
    this.mapPatchArray(patch);
    this._fieldService.updateField(this.currentField.id, patch).subscribe(
      (updateResponse: any) => {
        console.log(updateResponse);
        if (updateResponse.ok) {
          this._toastr.show(
            "Farm field details successfully updated!",
            "Success!",
            null,
            "toast-success"
          );
        }
      },
      (error: HttpErrorResponse) => {
        this._toastr.show(
          "Error updating field details!",
          "Error!",
          null,
          "toast-error"
        );
      }
    );
  }

  private mapPatchArray(patchArr: any[]) {
    patchArr.forEach((patch) => {
      if (patch.path === "/cropPests/pestEppoCode")
        patch.path = "/fieldCropDto/fieldCropPestDto/" + this.pestId;
    })
  }
}
