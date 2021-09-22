import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

import { farmRoute } from './farm.route';
import { FarmListComponent } from './farm-list/farm-list.component';
import { FarmDetailsComponent } from './farm-details/farm-details.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { AddFarmComponent } from './add-farm/add-farm.component';
import { EditFarmComponent } from './edit-farm/edit-farm.component';
import { FieldAddComponent } from '../field/field-add/field-add.component';
import { ApplicationPipesModule } from '@app/shared/pipes/application-pipes.module';

import { EppoCodePipe } from '../../../shared/pipes/eppo-code.pipe';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { DssModelRowComponent } from '../dss/dss-model-row.component';

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
    ApplicationPipesModule.forRoot(),
    AccordionModule.forRoot()
  ],
  declarations: [
    AddFarmComponent,
    FarmListComponent, 
    FarmDetailsComponent,
    EditFarmComponent,
    FieldAddComponent,
    DssModelRowComponent
  ],
  entryComponents: [
    FieldAddComponent
  ],
  providers: [EppoCodePipe]
})
export class FarmModule {}
