import { HttpErrorResponse } from "@angular/common/http";
import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormGroup, FormBuilder, Validators, FormArray } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { FarmService } from "@app/shared/services/upr/farm.service";
import { FieldService } from "@app/shared/services/upr/field.service";
@Component({
  selector: "app-field-add",
  templateUrl: "./field-add.component.html",
  styleUrls: ["./field-add.component.css"],
})
export class FieldAddComponent implements OnInit {
  fieldForm: FormGroup;
  cropPests: FormArray;
  farmName: string;
  constructor(
    private _fb: FormBuilder,
    private _fieldService: FieldService,
    private _toastr: ToastrService,
    private _farmService: FarmService,
  ) {}

  ngOnInit() {
    this.addFieldFormInit();
    this._farmService.currentFarm.subscribe(
      (farm) => (this.farmName = farm.name)
    );
  }
  
  addFieldFormInit() {
    this.fieldForm = this._fb.group({
      cropPests: this._fb.array([this.createCropPest()]),
      name: ["", Validators.required], //field name
      inf1: ["", Validators.required], //variety
      inf2: ["", Validators.required] //sowing date
    });
  }

  createCropPest(): FormGroup {
    return this._fb.group({
      cropEppoCode: ["", Validators.required],
      pestEppoCode: ["", Validators.required],
    });
  }

  addCropPestRow(): void {
    this.cropPests = this.fieldForm.get("cropPests") as FormArray;
    this.cropPests.push(this.createCropPest());
  }

  onCreateField() {
    const fieldFormValues = this.fieldForm.value;

    console.log('test', fieldFormValues);
    
    if (fieldFormValues) {
      this._fieldService.createField(fieldFormValues).subscribe(
        (fieldResponse) => {
          if (fieldResponse) {
            this._toastr.show(
              "Field added successfully!",
              "Success!",
              null,
              "toast-success"
            );
          }
        },
        (error: HttpErrorResponse) => {
          console.log("field error", error);
          this._toastr.show(
            "Fail to create new field!",
            "Error!",
            null,
            "toast-error"
          );
        }
      );
    }
  }
}
