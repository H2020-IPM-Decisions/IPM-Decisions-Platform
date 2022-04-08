import { Component, Input, Output, OnInit, TemplateRef} from '@angular/core';
import { EventEmitter } from '@angular/core';
import { DssModel, IDssFormData, DssSelection } from '../dss/dss-selection.model';
import { DssSelectionService } from './dss-selection.service';
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";

@Component({
    selector: '[app-dss-model-row]',
    templateUrl: './dss-model-row.component.html',
    styleUrls: ['./dss-model-row.component.css'],
    providers: [BsModalRef]
  })
export class DssModelRowComponent implements OnInit {

  @Input() public model!: DssModel;
  @Input() public selectedCrops!: string[];
  @Input() public dssSelection!: DssSelection;
  @Output() public select: EventEmitter<IDssFormData> = new EventEmitter();
  @Output() public deselect: EventEmitter<IDssFormData> = new EventEmitter();
  public selectedDss: boolean = false;
  public selectedCrop: string = "";
  public selectedPest: string = "";
  public countriesCodes: string[];
  modalRef: BsModalRef;

  constructor (
    private dssSelectionService: DssSelectionService,
    public _modalService: BsModalService
    ) {}

  ngOnInit(): void {
    if(this.model){
      if(this.model.pests.length ===1){
        this.selectedPest = this.model.pests[0];
      }
      if(this.model.crops.length > 0){
        this.model.crops = this.model.crops.filter(crop => this.selectedCrops.includes(crop));
        if(this.model.crops.length === 1){
          this.selectedCrop = this.model.crops[0];
        }
      }
      this.countriesCodes = this.model.valid_spatial.countries;
    }
  }
  cropSelectChanged(event: { target: HTMLInputElement }){
    this.selectedCrop = event.target.value
  }
  
  pestSelectChanged(event: { target: HTMLInputElement }){
    this.selectedPest = event.target.value
  }

  onSelect(){
    this.selectedDss = !this.selectedDss;
    const dssFormData: IDssFormData = this.dssSelectionService.getDssData(this.selectedCrop, this.selectedPest,this.dssSelection,this.model);
    this.select.emit(dssFormData);
  }

  onDeselect(){
    this.selectedDss = !this.selectedDss;
    const dssFormData: IDssFormData = this.dssSelectionService.getDssData(this.selectedCrop, this.selectedPest,this.dssSelection,this.model);
    this.deselect.emit(dssFormData);
  }

  openModal(template: TemplateRef<any>, size?: string) {
    this.modalRef = this._modalService.show(template, {class: size});
  }

}