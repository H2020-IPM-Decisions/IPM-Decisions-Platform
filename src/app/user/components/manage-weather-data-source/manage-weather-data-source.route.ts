import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';

import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { AuthGuard } from '@app/core/auth/guard/auth.guard';

import { IManageWeatherDataSource, ManageWeatherDataSource } from './manage-weather-data-source.model';
import { ManageWeatherDataSourceComponent } from './manage-weather-data-source.component';
import { ManageWeatherDataSourceService } from './manage-weather-data-source.service';
import { ManageWeatherDataSourceDetailComponent } from './manage-weather-data-source-detail.component';
import { ManageWeatherDataSourceUpdateComponent } from './manage-weather-data-source-update.component';


@Injectable({ providedIn: 'root' })
export class ManageWeatherDataSourceResolve implements Resolve<IManageWeatherDataSource> {
  constructor(private service: ManageWeatherDataSourceService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IManageWeatherDataSource> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        flatMap((response: HttpResponse<ManageWeatherDataSource>) => {
          if (response.body) {
            return of(response.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new ManageWeatherDataSource());
  }
}

export const manageWeatherDataSourceRoute: Routes = [
  {
    path: '',
    component: ManageWeatherDataSourceComponent,
    data: {
        roles: [], claims: ["developer", "farmer", "advisor","researcher"]
    },
    canActivate: [AuthGuard]
  },
  {
    path: ':id/view',
    component: ManageWeatherDataSourceDetailComponent,
    resolve: {
      setting: ManageWeatherDataSourceResolve
    },
    data: {
        roles: [], claims: ["developer", "farmer", "advisor","researcher"]
    },
    canActivate: [AuthGuard]
  },
  {
    path: 'new',
    component: ManageWeatherDataSourceUpdateComponent,
    resolve: {
      ManageWeatherData: ManageWeatherDataSourceResolve
    },
    data: {
        roles: [], claims: ["developer", "farmer", "advisor","researcher"]
    },
    canActivate: [AuthGuard]
  },
  {
    path: ':id/edit',
    component: ManageWeatherDataSourceUpdateComponent,
    resolve: {
      setting: ManageWeatherDataSourceResolve
    },
    data: {
        roles: [], claims: ["developer", "farmer", "advisor","researcher"]
    },
    canActivate: [AuthGuard]
  }
];
