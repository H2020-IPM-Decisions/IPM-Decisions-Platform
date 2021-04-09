import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { WeatherDataSource } from '@app/shared/models/weather-data-source.model';
import { WeatherService } from '@app/shared/services/wx/weather.service';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscription } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { IManageWeatherDataSource, ManageWeatherDataSource } from './manage-weather-data-source.model';
import { ManageWeatherDataSourceService } from './manage-weather-data-source.service';

@Component({
  selector: 'app-manage-weather-data-source-update',
  templateUrl: './manage-weather-data-source-update.component.html',
  styleUrls: ['./manage-weather-data-source-update.component.css']
})
export class ManageWeatherDataSourceUpdateComponent implements OnInit {
  isSaving = false;
  sourceToSelect = false;
  suscription$?: Subscription;
  dataSources = [];
  editForm = this.formBuilder.group({
    id: [],
    label: [{value: '', disabled: true}, Validators.required],
    url: [{value: '', disabled: true}, Validators.required],
    username: [null, [Validators.required]],
    password: [null, [Validators.required]]
  });

  constructor(private formBuilder: FormBuilder,
              protected activatedRoute: ActivatedRoute,
              protected toastrService: ToastrService,
              protected service: ManageWeatherDataSourceService,
              protected weatherService: WeatherService) { }

  ngOnInit() {
    this.suscription$ = this.activatedRoute.data
      .pipe(
        mergeMap( ({setting}) => {
          this.updateForm(setting);
          return this.weatherService.getWeatherDataSourceWithAuthentication();
        })
      ).subscribe( (data: WeatherDataSource[]) => {
          this.dataSources=data;
      })
    
  }

  updateForm(setting: IManageWeatherDataSource):void {
    if(!setting){
      setting = new ManageWeatherDataSource();
      this.sourceToSelect = true;
    }
    this.editForm.patchValue({
      id: setting.id,
      label: setting.label,
      url: setting.url,
      username: setting.username,
      password: setting.password
    });
  }

  save(): void {
    this.isSaving = true;
    const setting = this.createFromForm();
    if (setting.id !== undefined) {
      this.subscribeToSaveResponse(this.service.update(setting));
    } else {
      this.subscribeToSaveResponse(this.service.create(setting));
    }
  }

  private createFromForm(): IManageWeatherDataSource {
    return {
      ...new ManageWeatherDataSource(),
      id: this.editForm.get(['id'])!.value,
      label: this.editForm.get(['label'])!.value,
      url: this.editForm.get(['url'])!.value,
      username: this.editForm.get(['username'])!.value,
      password: this.editForm.get(['password'])!.value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IManageWeatherDataSource>>): void {
    result.subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.isSaving = false;
    this.previousState();
  }

  protected onSaveError(): void {
    this.isSaving = false;
    this.toastrService.show(
      "Error saving setting!",
      "Error!",
      null,
      "toast-error"
    );
  }
  
  selectSource(source:WeatherDataSource):void{
    this.editForm.patchValue({
      label: source.name,
      url: source.endpoint
    });
    this.sourceToSelect = false;
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
