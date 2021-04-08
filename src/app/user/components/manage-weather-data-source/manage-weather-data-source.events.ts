import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

class ManageWeatherDataSourceEventEmitter extends Subject<string> {
  constructor() {
    super();
  }
  emit(value: string): void {
    super.next(value);
  }
}

@Injectable({ providedIn: 'root' })
export class ManageWeatherDataSourcePubSubService {
  Stream: ManageWeatherDataSourceEventEmitter;
  constructor() {
    this.Stream = new ManageWeatherDataSourceEventEmitter();
  }
}