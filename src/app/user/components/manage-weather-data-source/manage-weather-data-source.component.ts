import { HttpResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { ManageWeatherDataSourceDeleteDialogComponent } from './manage-weather-data-source-delete-dialog.component';
import { ManageWeatherDataSourcePubSubService } from './manage-weather-data-source.events';
import { IManageWeatherDataSource } from './manage-weather-data-source.model';
import { ManageWeatherDataSourceService } from './manage-weather-data-source.service';

@Component({
  selector: 'app-manage-weather-data-source',
  templateUrl: './manage-weather-data-source.component.html',
  styleUrls: ['./manage-weather-data-source.component.css']
})
export class ManageWeatherDataSourceComponent implements OnInit, OnDestroy {
  dataSources?:IManageWeatherDataSource[] =[];
  suscription$?: Subscription;

  constructor(protected service: ManageWeatherDataSourceService,
              protected toastrService: ToastrService,
              private modalService: BsModalService,
              private eventService: ManageWeatherDataSourcePubSubService) { }

  ngOnInit() {
    this.loadData();
    this.suscription$ = this.eventService.Stream.subscribe((data)=>{
      this.loadData();
    })
  }

  loadData(){
    this.service.query().subscribe(
      (res:HttpResponse<IManageWeatherDataSource[]>) => {this.dataSources = res.body},
      () => this.onError()
    );
  }

  onError():void{
    this.toastrService.show(
      "Error fetching setting!",
      "Error!",
      null,
      "toast-error"
    );
  }

  delete(setting:IManageWeatherDataSource):void{
    const initialState:any={
      setting:setting
    };
    this.modalService.show(ManageWeatherDataSourceDeleteDialogComponent,{initialState});
  }

  ngOnDestroy(): void {
    if (this.suscription$) {
      this.suscription$.unsubscribe();
    }
  }
}
