import { HttpErrorResponse, HttpClient } from "@angular/common/http";
import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormGroup, FormBuilder, Validators, FormArray } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { FarmService } from "@app/shared/services/upr/farm.service";
import { FieldService } from "@app/shared/services/upr/field.service";
import { compare } from "fast-json-patch";
import { environment } from './../../../../../environments/environment';
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { Farm } from "@app/shared/models/farm.model";
import { Field } from "@app/shared/models/field.model";
import { CustomFieldService } from "../custom-field.service";
@Component({
  selector: "app-field-add",
  templateUrl: "./field-add.component.html",
  styleUrls: ["./field-add.component.css"],
})
export class FieldAddComponent implements OnInit {
  fieldForm: FormGroup;
  formFieldValues: FormGroup;
  cropPests: FormArray;
  farm: Farm;
  field: Field;
  pestId = '';
  crops: { value: string; label: string }[] = [];
  pests: { value: string; label: string }[] = [];
  constructor(
    private _fb: FormBuilder,
    private _fieldService: FieldService,
    private customFieldService: CustomFieldService,
    private _toastr: ToastrService,
    private http: HttpClient,
    private modalService: BsModalService,
    public bsModalRef: BsModalRef
  ) {
    this.farm = this.modalService.config.initialState['farm'];
    this.field = this.modalService.config.initialState['field'];
  }

  ngOnInit() {
    this.addFieldFormInit();
    this.customFieldService.cachedRefreshableCrops$.subscribe((data:{ value: any, label: any }[])=>{
      this.crops = data;
    });
    this.customFieldService.cachedRefreshablePests$.subscribe((data:{ value: any, label: any }[])=>{
      this.pests = data;
    });
  }

  addFieldFormInit() {
    this.fieldForm = this._fb.group({
      cropPest: this.createCropPest(),
      sowingDate: ["", Validators.required] //sowing date
    });
    if(this.field){
      this.fieldForm.patchValue({
        cropPest: {
          cropEppoCode: this.field.fieldCropDto.cropEppoCode,
          pestEppoCode: this.field.fieldCropDto.fieldCropPestDto.value[0].pestEppoCode
        },
        name: this.field.name,
        sowingDate: this.formatLocaleDateGB(this.field.sowingDate),
      });
      this.formFieldValues = this.fieldForm.value;
      this.pestId = this.field.fieldCropDto.fieldCropPestDto.value[0].id;
    }
  }

  private formatLocaleDateGB(unformatedDate: string) {
    return new Date(unformatedDate).toLocaleDateString("en-GB");
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
    fieldFormValues.name = "none";

    if (fieldFormValues) {
      this._fieldService.createField(fieldFormValues,this.farm.id).subscribe(
        (fieldResponse) => {
          if (fieldResponse) {
            this._toastr.show(
              "Field added successfully!",
              "Success!",
              null,
              "toast-success"
            );
            this.close();
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

  onEditFieldSubmit() {
    const updatedFieldValues = this.fieldForm.value;
    const patch = compare(this.formFieldValues, updatedFieldValues);
    this.mapPatchArray(patch);
    this._fieldService.updateField(this.farm.id, this.field.id, patch).subscribe(
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
        this.close();
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

  close():void{
    this.bsModalRef.hide();
  }
  
  private mapPatchArray(patchArr: any[]) {
    patchArr.forEach((patch) => {
      if (patch.path === "/cropPests/pestEppoCode")
        patch.path = "/fieldCropDto/fieldCropPestDto/" + this.pestId;
    })
  }
}
