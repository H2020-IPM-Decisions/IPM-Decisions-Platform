import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, Routes } from '@angular/router';

import { AuthGuard } from '@app/core/auth/guard/auth.guard';
import { EMPTY, Observable, of } from 'rxjs';
import { flatMap } from 'rxjs/operators';
import { DssDashboardComponent } from './dss-dashboard.component';
import { DssDetailComponent } from './dss-detail.component';
import { DssSelectionComponent } from './dss-selection.component';
import { IDssFlat } from './dss-selection.model';
import { DssSelectionService } from './dss-selection.service';
import { DssComparisonComponent } from './dss-comparison.component';

@Injectable({ providedIn: 'root' })
export class DssDetailResolve implements Resolve<IDssFlat> {
  constructor(private service: DssSelectionService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IDssFlat> {
    const id = route.params['id'];
    if (id) {
      return this.service.get(id).pipe(
        flatMap((response: HttpResponse<IDssFlat>) => {
          if (response.body) {
            return of(response.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of();
  }
}

export const dssSelectionRoute: Routes = [
  {
    path: '',
    redirectTo: 'selection',
    pathMatch: 'prefix'
  },
  /*{
    path: 'selection',
    component: DssSelectionComponent,
    data: {
        roles: [], claims: ["developer", "farmer", "advisor","researcher"]
    },
    canActivate: [AuthGuard]
  },*/
  {
    path: 'dashboard',
    children:[
      {
        path:'',
        component: DssDashboardComponent,
        data: {
            roles: [], claims: ["developer", "farmer", "advisor","researcher"]
        },
        canActivate: [AuthGuard]
      },
      {
        path: ':id/view',
        component: DssDetailComponent,
        resolve: {
          dssDetail: DssDetailResolve
        },
        data: {
            roles: [], claims: ["developer", "farmer", "advisor","researcher"]
        },
        canActivate: [AuthGuard]
      }
    ]
  },
  {
    path: 'comparison',
    component: DssComparisonComponent,
    data: {
        roles: [], claims: ["developer", "farmer", "advisor","researcher"]
    },
    canActivate: [AuthGuard]
  }
];
