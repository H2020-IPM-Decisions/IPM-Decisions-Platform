import { Component, Input, Output, OnInit, TemplateRef, EventEmitter } from "@angular/core";
import { IDssFlat, IDssFormData } from "./dss-selection.model";
import { DssSelectionService } from "./dss-selection.service";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { NGXLogger } from 'ngx-logger';

@Component({
  selector: "[app-dss-linked-row]",
  templateUrl: "./dss-linked-row.component.html",
  styleUrls: ["./dss-linked-row.component.css"],
})
export class DssLinkedRow implements OnInit {
  @Input() public model!: IDssFlat;
  @Input() public isEditing!: boolean;
  @Input() public isUserSelected!: boolean;
  @Output() public select: EventEmitter<IDssFormData> = new EventEmitter();
  @Output() public deselect: EventEmitter<IDssFormData> = new EventEmitter();
  @Output() public delete: EventEmitter<string> = new EventEmitter();
  public modalRef: BsModalRef;
  public selectedDss: boolean = false;

  constructor (
    private _dssSelectionService: DssSelectionService,
    public _modalService: BsModalService,
    private _logger: NGXLogger
  ) {}

  ngOnInit(): void {
    this._logger.debug("DSS Linked row Model loaded",this.model);
  }

  onSelect($event: any){
    this.selectedDss = !this.selectedDss;
    const dssFormData: IDssFormData = this._dssSelectionService.getDssDataFromDssFlat(this.model);
    this.select.emit(dssFormData);
  }

  onDeselect($event: any){
    this.selectedDss = !this.selectedDss;
    const dssFormData: IDssFormData = this._dssSelectionService.getDssDataFromDssFlat(this.model);
    this.deselect.emit(dssFormData);
  }

  onDelete($event: any) {
    this._logger.debug("MODEL",this.model)
    this.delete.emit(this.model.dssDatabaseId);
  }

  openModal(template: TemplateRef<any>, size?: string) {
    this.modalRef = this._modalService.show(template, {class: size});
  }
}