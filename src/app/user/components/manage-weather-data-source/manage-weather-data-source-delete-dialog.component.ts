import { Component } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { ManageWeatherDataSourcePubSubService } from './manage-weather-data-source.events';
import { IManageWeatherDataSource } from './manage-weather-data-source.model';
import { ManageWeatherDataSourceService } from './manage-weather-data-source.service';

@Component({
  templateUrl: './manage-weather-data-source-delete-dialog.component.html'
})
export class ManageWeatherDataSourceDeleteDialogComponent {
  setting:IManageWeatherDataSource;
  constructor(public bsModalRef: BsModalRef, 
              private modalService: BsModalService,
              protected toastrService: ToastrService,
              protected service: ManageWeatherDataSourceService,
              private eventService: ManageWeatherDataSourcePubSubService) {
    this.setting = this.modalService.config.initialState['setting'];
  }

  close():void{
    this.bsModalRef.hide();
  }

  delete():void{
    if(this.setting){
      this.service.delete(this.setting.id).subscribe(
        () => this.onSaveSuccess(),
        () => this.onSaveError()
      );
    }
    this.bsModalRef.hide();
  }

  onSaveSuccess(): void {
    this.eventService.Stream.emit('ManageWeatherDataSourceDeleted');
    this.close();
  }

  onSaveError(): void {
    this.toastrService.show(
      "Error deleting setting!",
      "Error!",
      null,
      "toast-error"
    );
    this.close();
  }
  
}
