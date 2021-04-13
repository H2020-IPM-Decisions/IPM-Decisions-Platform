import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';

import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { AuthGuard } from '@app/core/auth/guard/auth.guard';
import { FarmResponseModel } from '@app/shared/models/farm-response.model';
import { FarmService } from '@app/shared/services/upr/farm.service';
import { FarmListComponent } from './farm-list/farm-list.component';
import { FarmDetailsComponent } from './farm-details/farm-details.component';
import { EditFarmComponent } from './edit-farm/edit-farm.component';
import { AddFarmComponent } from './add-farm/add-farm.component';


@Injectable({ providedIn: 'root' })
export class FarmResponseModelResolve implements Resolve<FarmResponseModel> {
  constructor(private service: FarmService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<FarmResponseModel> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        flatMap((response: HttpResponse<FarmResponseModel>) => {
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

export const farmRoute: Routes = [
  {
    path: '',
    component: FarmListComponent,
    data: {
        roles: [], claims: ["developer", "farmer", "advisor"]
    },
    canActivate: [AuthGuard]
  },
  {
    path: ':id/view',
    component: FarmDetailsComponent,
    resolve: {
      farm: FarmResponseModelResolve
    },
    data: {
        roles: [], claims: ["developer", "farmer", "advisor"]
    },
    canActivate: [AuthGuard]
  },
  {
    path: 'new',
    component: AddFarmComponent,
    resolve: {
    },
    data: {
        roles: [], claims: ["developer", "farmer", "advisor"]
    },
    canActivate: [AuthGuard]
  },
  {
    path: ':id/edit',
    component: AddFarmComponent,
    resolve: {
      farm: FarmResponseModelResolve
    },
    data: {
        roles: [], claims: ["developer", "farmer", "advisor"]
    },
    canActivate: [AuthGuard]
  }
];
