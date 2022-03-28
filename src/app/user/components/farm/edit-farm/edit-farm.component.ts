import { DssSelectionService } from './../../dss/dss-selection.service';
import { HttpErrorResponse } from "@angular/common/http";
import { AfterViewInit, Component, Input, OnDestroy, OnInit, TemplateRef } from "@angular/core";
import { Farm } from "@app/shared/models/farm.model";
import { Field } from "@app/shared/models/field.model";
import { WeatherDataSource } from "@app/shared/models/weather-data-source.model";
import { FieldService } from "@app/shared/services/upr/field.service";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { DssModelAddComponent } from '../../dss/dss-model-add.component';
import { Subscription } from 'rxjs';
import { NGXLogger } from 'ngx-logger';
import { ToastrTranslationService } from "@app/shared/services/toastr-translation.service";

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
  metStationSelected = 0;
  weatherForecastSelected = 1;
  sortHeaderIndex: number;

  constructor(
    public _modalService: BsModalService,
    private _fieldService: FieldService,
    private _dssSelectionService: DssSelectionService,
    private _logger: NGXLogger,
    private _toastrTranslated: ToastrTranslationService
  ) { }

  ngOnInit() {
    if (this.farm.id) {
      this.onGetFields(this.farm.id);
    }
    this.$subscription = this._modalService.onHide.subscribe((data) => {
      this.onGetFields(this.farm.id);
    })
  }

  ngAfterViewInit(): void {

  }

  ngOnDestroy() {
    if (this.$subscription) {
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
          this._toastrTranslated.showTranslatedToastr("Error_messages.Field_detail_fetching_error","Common_labels.Error","toast-error");
        }
      }
    );
  }

  onDssModelDelete(fieldId: string, cropPestComboId: string, dssModelId: string): void {
    if (!dssModelId) {
      return;
    }
    this._dssSelectionService.del(dssModelId).subscribe(() => {
      this._toastrTranslated.showTranslatedToastr("Information_messages.DSS_deletion","Common_labels.Success","toast-success");
      this.modalRef.hide();
      this.checkAndCleanFieldArray(fieldId, cropPestComboId, dssModelId);
    }, () => {
      this._toastrTranslated.showTranslatedToastr("Error_messages.DSS_deletion_error","Common_labels.Error","toast-error");
    });
  }

  checkAndCleanFieldArray(fieldId: string, cropPestComboId: string, dssModelId: string): void {
    const fieldIndex: number = this.fieldList.findIndex(
      (item) => item.id === fieldId
    );
    if (fieldIndex !== -1) {
      const cropPestComboIndex: number = this.fieldList[fieldIndex].fieldCropDto.fieldCropPestDto.value.findIndex(
        (cpcItem) => cpcItem.id === cropPestComboId
      );
      if ((cropPestComboIndex !== -1) && this.fieldList[fieldIndex].fieldCropDto.fieldCropPestDto.value[cropPestComboIndex].fieldCropPestDssDto.value.length == 1) {
        let allCropPestDssDtoArraysAreClean: boolean = true;
        let cropPestDtoArray = this.fieldList[fieldIndex].fieldCropDto.fieldCropPestDto.value;
        for (let i = 0; i < cropPestDtoArray.length; i++) {
          if (i == cropPestComboIndex) {
            continue;
          }
          if (cropPestDtoArray[i].fieldCropPestDssDto.value.length > 0) {
            allCropPestDssDtoArraysAreClean = false;
            break;
          }
        }
        if (allCropPestDssDtoArraysAreClean) {
          this._logger.debug("Last DSS Model was deleted from the field, removing the field from the array");
          this.fieldList.splice(fieldIndex, 1);
        }
      }
    }
  }

  openModal(template: TemplateRef<any>, field: any, size?: string) {
    this.modalRef = this._modalService.show(template, { class: size });
    this.showFieldDetails(field);
  }

  openModalDssModelAdd(field?: Field): void {
    const initialState: any = {
      farm: this.farm,
      field: field
    };
    this._modalService.show(DssModelAddComponent, { initialState, class: 'modal-lg' }).content;
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
    if (!val) { return false; }
    return ((typeof val === 'function') || (typeof val === 'object'));
  };

  public sortTable(columnIndex: number) {
    var table, rows, switching, i, x, y, shouldSwitch;
    table = document.getElementById("dssTable");
    switching = true;
    this.sortHeaderIndex = columnIndex;
    /*Make a loop that will continue until
    no switching has been done:*/
    while (switching) {
      //start by saying: no switching is done:
      switching = false;
      rows = table.rows;
      /*Loop through all table rows (except the
      first, which contains table headers):*/
      for (i = 1; i < (rows.length - 1); i++) {
        //start by saying there should be no switching:
        shouldSwitch = false;
        /*Get the two elements you want to compare,
        one from current row and one from the next:*/
        x = rows[i].getElementsByTagName("TD")[columnIndex];
        y = rows[i + 1].getElementsByTagName("TD")[columnIndex];
        //check if the two rows should switch place:
        if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
          //if so, mark as a switch and break the loop:
          shouldSwitch = true;
          break;
        }
      }
      if (shouldSwitch) {
        /*If a switch has been marked, make the switch
        and mark that a switch has been done:*/
        rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
        switching = true;
      }
    }
  }
}
