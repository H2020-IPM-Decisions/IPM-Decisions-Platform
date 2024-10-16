import { Injectable } from '@angular/core';
import { Subscription } from "rxjs";
import { switchMap } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { NGXLogger } from "ngx-logger";
import { ToastrService } from "ngx-toastr";

@Injectable({
    providedIn: 'root'
})

export class ToastrTranslationService {
    private subscriptionToastTranslation: Subscription;
    private message: any;
    private title: any;

    constructor(
        private _toastr: ToastrService,
        private _logger: NGXLogger,
        private _translate: TranslateService
    ) {}

    public showTranslatedToastr(messageKeyToTranslate: string, titleKeyToTranslate: string, toastrType: string): void {
        this.initToastMessageTranslated(messageKeyToTranslate,titleKeyToTranslate);
        this._toastr.show(
            this.message,
            this.title,
            null,
            toastrType
        );
    }

    public showTranslatedToastrWithOptions(messageKeyToTranslate: string, titleKeyToTranslate: string, toastrType: string, prefix?: string, suffix?: string): void {
      this.initToastMessageTranslated(messageKeyToTranslate,titleKeyToTranslate);
      this._toastr.toastrConfig.preventDuplicates = true;
      this._toastr.show(
          prefix + this.message + suffix,
          this.title,
          { disableTimeOut: true,
            closeButton: true
          },
          toastrType
      );
    }

    public showTranslatedToastrWithDynamicParam(messageKeyToTranslate: string, titleKeyToTranslate: string, toastrType: string, param?: any): void {
      this.initToastMessageTranslated(messageKeyToTranslate,titleKeyToTranslate, param);
      this._toastr.toastrConfig.preventDuplicates = true;
      this._toastr.show(
          this.message,
          this.title,
          { disableTimeOut: true,
            closeButton: true
          },
          toastrType
      );
    } 

    private initToastMessageTranslated(messageKeyToTranslate: string, titleKeyToTranslate: string, param?: any): void {
        this.subscriptionToastTranslation = this._translate.get(messageKeyToTranslate, {value: param}).pipe(
          switchMap((messageContent) => {
            this.message = messageContent;
            return this._translate.get(titleKeyToTranslate)}),
        ).subscribe((titleContent)=> {
          this.title = titleContent;
        });      
      }
    
      ngOnDestroy() {
        this.subscriptionToastTranslation.unsubscribe();
      }
}