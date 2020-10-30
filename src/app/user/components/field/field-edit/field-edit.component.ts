import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: "app-field-edit",
  templateUrl: "./field-edit.component.html",
  styleUrls: ["./field-edit.component.css"],
})
export class FieldEditComponent implements OnInit {
  addFieldForm: FormGroup;
  constructor(private _fb: FormBuilder, private _toastr: ToastrService) {}

  ngOnInit() {
    this.addFieldFormInit();
  }

  addFieldFormInit() {
    this.addFieldForm = this._fb.group({
      crop: ["Wheat", Validators.required],
      pest: ["Aphids", Validators.required],
      field: ["Field 1", Validators.required],
      variety: ["Variety_x", Validators.required],
      sowingDate: ["06/08/2019", Validators.required],
    });
  }

  onEditField() {
    this._toastr.show(
      "Field updated successfully!",
      "Success!",
      null,
      "toast-success"
    );
  }
}
