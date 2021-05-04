import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { dssSelectionRoute } from './dss-selection.route';
import { DssSelectionComponent } from './dss-selection.component';
import { DssDashboardComponent } from './dss-dashboard.component';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { EppoCodeBadgeComponent } from '../eppo-code-evaluator/eppo-code-badge.component';
import { EppoCodePipe } from '../eppo-code-evaluator/eppo-code.pipe';

@NgModule({
  imports: [ 
    RouterModule.forChild(dssSelectionRoute),
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BsDropdownModule.forRoot()
  ],
  declarations: [
    DssSelectionComponent,
    DssDashboardComponent,
    EppoCodeBadgeComponent,
    EppoCodePipe
  ],
  entryComponents: []
})
export class DssSelectionModule {}
