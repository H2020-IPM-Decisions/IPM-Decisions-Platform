import { Routes } from '@angular/router';

import { AuthGuard } from '@app/core/auth/guard/auth.guard';
import { DssDashboardComponent } from './dss-dashboard.component';
import { DssSelectionComponent } from './dss-selection.component';


export const dssSelectionRoute: Routes = [
  {
    path: '',
    redirectTo: 'selection',
    pathMatch: 'prefix'
  },
  {
    path: 'selection',
    component: DssSelectionComponent,
    data: {
        roles: [], claims: ["developer", "farmer", "advisor"]
    },
    canActivate: [AuthGuard]
  },
  {
    path: 'dashboard',
    component: DssDashboardComponent,
    data: {
        roles: [], claims: ["developer", "farmer", "advisor"]
    },
    canActivate: [AuthGuard]
  }
];
