import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { IManageWeatherDataSource } from './manage-weather-data-source.model';

@Component({
  selector: 'app-manage-weather-data-source-detail',
  templateUrl: './manage-weather-data-source-detail.component.html',
  styleUrls: ['./manage-weather-data-source-detail.component.css']
})
export class ManageWeatherDataSourceDetailComponent implements OnInit, OnDestroy {
  setting: IManageWeatherDataSource|null = null;
  suscription$?: Subscription;

  constructor(protected activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.suscription$ = this.activatedRoute.data
      .subscribe( ({setting}) => {
          this.setting = setting;
        }
      );
  }

  ngOnDestroy(): void {
    if (this.suscription$) {
      this.suscription$.unsubscribe();
    }
  }

  previousState(): void {
    window.history.back();
  }

}
