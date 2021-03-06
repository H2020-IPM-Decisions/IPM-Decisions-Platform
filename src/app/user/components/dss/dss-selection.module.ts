import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { dssSelectionRoute } from './dss-selection.route';
import { DssSelectionComponent } from './dss-selection.component';
import { DssDashboardComponent } from './dss-dashboard.component';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { EppoCodeBadgeComponent } from '../eppo-code-evaluator/eppo-code-badge.component';
import { ApplicationPipesModule } from '@app/shared/pipes/application-pipes.module';
import { DssDetailComponent } from './dss-detail.component';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { CustomChartComponent } from './custom-chart/custom-chart.component';
import { PopoverModule } from 'ngx-bootstrap/popover';

@NgModule({
  imports: [ 
    RouterModule.forChild(dssSelectionRoute),
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BsDropdownModule.forRoot(),
    ApplicationPipesModule.forRoot(),
    TooltipModule.forRoot(),
    PopoverModule.forRoot(),
  ],
  declarations: [
    DssSelectionComponent,
    DssDashboardComponent,
    EppoCodeBadgeComponent,
    DssDetailComponent,
    CustomChartComponent
  ],
  entryComponents: []
})
export class DssSelectionModule {}
