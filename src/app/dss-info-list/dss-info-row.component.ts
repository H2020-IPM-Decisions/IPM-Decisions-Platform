import { Component, Input, OnInit, TemplateRef} from '@angular/core';
import { DssModel, DssSelection } from '@app/user/components/dss/dss-selection.model';
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";

@Component({
    selector: '[app-dss-info-row]',
    templateUrl: './dss-info-row.component.html',
    styleUrls: ['./dss-info-row.component.css'],
    providers: [BsModalRef]
  })
export class DssInfoRowComponent implements OnInit {

  @Input() public model!: DssModel;
  @Input() public selectedCrops!: string[];
  @Input() public dssSelection!: DssSelection;

  public countriesCodes: string[];
  public dssCropsList: string[];
  public dssPestsList: string[];
  public modelPurpose: string;
  modalRef: BsModalRef;

  constructor (
    public _modalService: BsModalService
    ) {}

  ngOnInit(): void {
    if(this.model){
      if(this.model.crops){
        this.dssCropsList = this.model.crops;
      }
      if(this.model.pests){
        this.dssPestsList = this.model.pests;
      }
      this.countriesCodes = this.model.valid_spatial.countries;
      this.modelPurpose = this.model.purpose;
    }
  }

  openModal(template: TemplateRef<any>, size?: string) {
    this.modalRef = this._modalService.show(template, {class: size});
  }

}