import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ManageWeatherDataSourceComponent } from './manage-weather-data-source.component';
import { ManageWeatherDataSourceDetailComponent } from './manage-weather-data-source-detail.component';
import { ManageWeatherDataSourceUpdateComponent } from './manage-weather-data-source-update.component';
import { ManageWeatherDataSourceDeleteDialogComponent } from './manage-weather-data-source-delete-dialog.component';
import { manageWeatherDataSourceRoute } from './manage-weather-data-source.route';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';

@NgModule({
  imports: [ 
    RouterModule.forChild(manageWeatherDataSourceRoute),
    ModalModule.forRoot(),
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    ManageWeatherDataSourceComponent, 
    ManageWeatherDataSourceDetailComponent, 
    ManageWeatherDataSourceUpdateComponent, 
    ManageWeatherDataSourceDeleteDialogComponent
  ],
  entryComponents: [ManageWeatherDataSourceDeleteDialogComponent]
})
export class EffectorManageWeatherDataSourceModule {}
