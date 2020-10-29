import { Component, OnInit } from "@angular/core";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-field-add",
  templateUrl: "./field-add.component.html",
  styleUrls: ["./field-add.component.css"],
})
export class FieldAddComponent implements OnInit {
  constructor(private _toastr: ToastrService) {}

  ngOnInit() {}

  onAddField() {
    this._toastr.show(
      "Field added successfully!",
      "Success!",
      null,
      "toast-success"
    );
  }
}
