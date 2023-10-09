import { Component, Input, OnInit} from '@angular/core';
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { IDSSDisabled } from './edit-disabled-dss.model';
import { DssSelectionService } from "../../dss/dss-selection.service";
import { HttpErrorResponse } from '@angular/common/http';

@Component({
    selector: '[app-edit-disabled-dss-row]',
    templateUrl: './edit-disabled-dss-row.component.html',
    styleUrls: ['./edit-disabled-dss-row.component.css'],
    providers: [BsModalRef]
  })
export class DssDisabledRowComponent implements OnInit {

  @Input() public model!: IDSSDisabled;

  public dssName: string;
  public source: string;
  public isDisabled: boolean;
  public modelStatus: string = "";
  modalRef: BsModalRef;

  constructor (
    public _modalService: BsModalService,
    private _dssSelectionService: DssSelectionService
    ) {}

  updateModelStatus(){
    if(this.isDisabled){
      this.modelStatus = "Disabled";
    }else{
      this.modelStatus = "Enabled";
    }
  }
  ngOnInit(): void {
    if(this.model){
      this.dssName = this.model.dssModelName;
      this.source = this.model.dssName;
      this.isDisabled = this.model.isDisabled;
      this.updateModelStatus();
      
    }



  }

  enableDSS(){
    this._dssSelectionService.enableDss(this.model.id).subscribe(
      (response) => {
        if (response) {
          this.isDisabled = false;
          this.updateModelStatus();
        }
      },
      (error: HttpErrorResponse) => {
        console.log("Error during enabling DSS")
      }
    );;
  }

  disableDSS(){

    let requestBody = [];
        
    requestBody.push(this._dssSelectionService.getDisableDssFromData(this.model.dssId, this.model.dssVersion, this.model.dssModelId, this.model.dssModelVersion));
    this._dssSelectionService.disableDss(requestBody).subscribe(
      (response) => {
        if (response) {
          this.isDisabled = true;
          this.updateModelStatus();
        }
      },
      (error: HttpErrorResponse) => {
        console.log("Error during disabling DSS")
      }
    );
  }

}