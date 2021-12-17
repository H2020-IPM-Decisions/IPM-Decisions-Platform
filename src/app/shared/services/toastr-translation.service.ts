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

    private initToastMessageTranslated(messageKeyToTranslate: string, titleKeyToTranslate: string): void {
        this.subscriptionToastTranslation = this._translate.get(messageKeyToTranslate).pipe(
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