import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-field-add",
  templateUrl: "./field-add.component.html",
  styleUrls: ["./field-add.component.css"],
})
export class FieldAddComponent implements OnInit {

  addFieldForm: FormGroup;
  constructor(private _fb: FormBuilder, private _toastr: ToastrService) {}

  ngOnInit() {
    this.addFieldFormInit();
  }


  addFieldFormInit() {
    this.addFieldForm = this._fb.group({
      crop: ["", Validators.required],
      pest: ["", Validators.required],
      field: ["", Validators.required],
      variety: ["", Validators.required],
      sowingDate: ["", Validators.required]
    });
  }

  onAddField() {
    this._toastr.show(
      "Field added successfully!",
      "Success!",
      null,
      "toast-success"
    );
  }
}
