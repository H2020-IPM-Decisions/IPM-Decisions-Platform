import { DssSelectionService } from './../../dss/dss-selection.service';
import { environment } from './../../../../../environments/environment';
import { HttpClient, HttpErrorResponse, HttpResponse } from "@angular/common/http";
import {
  AfterViewInit,
  Component,
  Input,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
} from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { Router } from "@angular/router";
import { Farm } from "@app/shared/models/farm.model";
import { Field } from "@app/shared/models/field.model";
import { WeatherDataSource } from "@app/shared/models/weather-data-source.model";
import { FieldService } from "@app/shared/services/upr/field.service";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { ToastrService } from "ngx-toastr";
import { DssModelAddComponent } from '../../dss/dss-model-add.component';
import { Subscription } from 'rxjs';
import { FieldEditComponent } from '../../field/field-edit/field-edit.component';
@Component({
  selector: "app-edit-farm",
  templateUrl: "./edit-farm.component.html",
  styleUrls: ["./edit-farm.component.css"],
  providers: [BsModalRef],
})
export class EditFarmComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input()
  farm: Farm;
  fieldList: any[] = [];
  modalRef: BsModalRef;
  selectedCrop: any;
  $subscription: Subscription;

  @ViewChild('addObservationTemplate', { static: false }) public addObservationTemplate: TemplateRef<any>;
  observationModalRef: BsModalRef;
  observationModalForm = this._fb.group({
    time: [""],
    severity: [""]
  })
  addObservation(field) {
    let requestBody = this.observationModalForm.value;
    requestBody.fieldCropPestId = field.fieldCropDto.fieldCropPestDto.value[0].id;
    requestBody.location = { x: 0, y: 0, srid: 4236 };
    this.http
      .post(`${environment.apiUrl}/api/upr/fields/${field.id}/observations`, requestBody)
      .subscribe((x) => {
        this.onGetFields(
          this.farm.id,
          () => {
            this.observationModalRef.hide();
          }
        );
      })
  }

  @ViewChild('addSprayTemplate', { static: false }) public addSprayTemplate: TemplateRef<any>;
  sprayModalRef: BsModalRef;
  sprayModalForm = this._fb.group({
    name: [""],
    time: [""],
    rate: [""]
  })
  addSpray(field) {
    let requestBody = this.sprayModalForm.value;
    requestBody.fieldCropPestId = field.fieldCropDto.fieldCropPestDto.value[0].id;
    this.http
      .post(`${environment.apiUrl}/api/upr/fields/${field.id}/sprayapplications`, requestBody)
      .subscribe((x) => {
        this.onGetFields(
          this.farm.id,
          () => {
            this.sprayModalRef.hide();
          }
        );
      })
  }

  metStationSelected = 0;
  weatherForecastSelected = 1;

  constructor(
    private _fb: FormBuilder,
    public _modalService: BsModalService,
    private _router: Router,
    private _fieldService: FieldService,
    private _toastr: ToastrService,
    private http: HttpClient,
    private _dssSelectionService: DssSelectionService
  ) { }

  ngOnInit() {
    if (this.farm.id) {
      this.onGetFields(this.farm.id);
    }
    this.$subscription = this._modalService.onHide.subscribe((data)=>{
      this.onGetFields(this.farm.id);
    })
  }

  ngAfterViewInit(): void {
    
  }

  ngOnDestroy(){
    if(this.$subscription){
      this.$subscription.unsubscribe();
    }
  }

  onGetFields(farmId: string, onFieldUpdateFunc = () => { }) {
    this._fieldService.getFields(farmId).subscribe(
      (fields: any) => {
        if (fields && fields.value) {
          this.fieldList = fields.value;
          onFieldUpdateFunc()
        }
      },
      (error: HttpErrorResponse) => {
        if (error.status !== 404) {
          this._toastr.show(
            "Error fetching field detail!",
            "Error!",
            null,
            "toast-error"
          );
        }
      }
    );
  }

  openModalEditField(field: Field):void{
    const initialState:any={
      farm:this.farm,
      field: field
    };
    this._modalService.show(FieldEditComponent,{initialState}).content;
  }

  onFieldCopy(field: any) {
    let cropPest ={};
    try {
      cropPest = {
        cropEppoCode: field.fieldCropDto.cropEppoCode,
        pestEppoCode: field.fieldCropDto.fieldCropPestDto.value[0].pestEppoCode
      }
    } catch (error) {
      this._toastr.show(
        "Fail to copy field!",
        "Error!",
        null,
        "toast-error"
      );
      return;
    }
    const fieldToCopy:any = {
      sowingDate: field.sowingDate,
      name: 'none',
      cropPest:cropPest
    }
    this._fieldService.createField(fieldToCopy,this.farm.id).subscribe(
      (fieldResponse) => {
        if (fieldResponse) {
          this._toastr.show(
            "Field added successfully!",
            "Success!",
            null,
            "toast-success"
          );
          this.onGetFields(this.farm.id);
        }
      },
      (error: HttpErrorResponse) => {
        //console.log("field error", error);
        this._toastr.show(
          "Fail to create new field!",
          "Error!",
          null,
          "toast-error"
        );
      }
    );
  
    
  }

  onDssModelDelete(dssModelId: string): void{
    if(!dssModelId) {
      return;
    }
    this._dssSelectionService.del(dssModelId).subscribe(()=>{
      this._toastr.success("Operation Success","DSS Deleted");
      this.modalRef.hide();
    },()=>{
      this._toastr.error("Operation Failed","No DSS deleted");
    });
  }

  onFieldDelete(fieldId: string) {
    if (fieldId) {
      this._fieldService
        .deleteFieldById(this.farm.id, fieldId)
        .subscribe((response: HttpResponse<any>) => {
          if (response.status === 204) {
            this.modalRef.hide();

            const index: number = this.fieldList.findIndex(
              (item) => item.id === fieldId
            );

            if (index !== -1) {
              this.fieldList.splice(index, 1);
            }
          }
        });
    }
  }

  openModal(template: TemplateRef<any>, field: any, size?: string) {
    this.modalRef = this._modalService.show(template, {class: size});
    this.showFieldDetails(field);
  }

  openModalDssModelAdd(field?:Field):void{
    const initialState:any={
      farm:this.farm,
      field: field      
    };
    this._modalService.show(DssModelAddComponent,{initialState, class: 'modal-lg'}).content;
  }



  showFieldDetails(field: any) {
    this.selectedCrop = field;
  }

  compareByID(objOne: WeatherDataSource, objTwo: WeatherDataSource) {
    return objOne && objTwo && objOne.id == objTwo.id;
  }

  //todo: duplicate method in field and farm edit component. put metod in service
  public formatLocaleDateGB(unformatedDate: string) {
    return new Date(unformatedDate).toLocaleDateString("en-GB");
  }

  public isObject(val: any): boolean {
    if (!val) { return false;}
    return ((typeof val === 'function') || (typeof val === 'object'));
  };
}
