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
import { CustomGroupChartComponent } from './custom-chart/custom-group-chart.component';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { TranslateModule} from '@ngx-translate/core';
import { DssComparisonComponent } from './dss-comparison.component';
import { DssComparisonRowComponent } from './dss-comparison-row.component';
import { ResizeBorderComponent } from '@app/shared/resize-border/resize-border.component';

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
    AccordionModule.forRoot(),
    TranslateModule
  ],
  declarations: [
    DssSelectionComponent,
    DssDashboardComponent,
    EppoCodeBadgeComponent,
    DssDetailComponent,
    CustomChartComponent,
    CustomGroupChartComponent,
    DssComparisonComponent,
    DssComparisonRowComponent,
    ResizeBorderComponent
  ],
  entryComponents: []
})
export class DssSelectionModule {}
