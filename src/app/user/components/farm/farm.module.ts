import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

import { farmRoute } from './farm.route';
import { EditFarmComponent } from './edit-farm/edit-farm.component';
import { FarmListComponent } from './farm-list/farm-list.component';
import { FarmDetailsComponent } from './farm-details/farm-details.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

@NgModule({
  imports: [ 
    RouterModule.forChild(farmRoute),
    ModalModule.forRoot(),
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BsDropdownModule.forRoot(),
    BsDatepickerModule.forRoot(),
    TooltipModule.forRoot(),
  ],
  declarations: [
    EditFarmComponent, 
    FarmListComponent, 
    FarmDetailsComponent
  ],
  entryComponents: []
})
export class FarmModule {}
