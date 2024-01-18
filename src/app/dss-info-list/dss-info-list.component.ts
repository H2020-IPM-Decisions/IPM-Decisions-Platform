import { Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CMSService } from '@app/shared/services/cms.service';
import { DomSanitizer } from '@angular/platform-browser'
import { AuthenticationService } from '@app/core/auth/services/authentication.service';
import { Subscription, timer } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CountryNamePipe } from '@app/shared/pipes/country-name.pipe';
import { ToastrTranslationService } from '@app/shared/services/toastr-translation.service';
import { EppoCodeService } from '@app/shared/services/upr/eppo-code.service';
import { DssSelectionService } from '@app/user/components/dss/dss-selection.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NGXLogger } from 'ngx-logger';
import { EppoCode } from '@app/shared/models/eppo-code.model';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { DssSelection } from '@app/user/components/dss/dss-selection.model';
import { specialCharacterComparator } from '@app/shared/models/specialCharactersComparator.model';

declare var init: any;
declare var home: any;

@Component({
    selector: 'dss-info-list',
    templateUrl: './dss-info-list.component.html',
    styleUrls: ['./dss-info-list.component.css', '../home/./newstyle.css'], //NEW TEMPLATE
})
export class DssInfoListComponent implements OnInit {

    bannerUrl = "";
    footerContent: any;
    homeTitle: string;
    footerMiddleContent: any;
    cropsEppoCodes: EppoCode[] = [];
    integratedDss: DssSelection[] = [];
    externalDss: DssSelection[] = [];
    selCropForm: FormGroup;
    modalRef: BsModalRef;
    areCropsSelected: boolean = false;

    public isLoggedIn: boolean;
    public DssListFiltered: boolean = false; 
    public username: string;
    public $accountSub: Subscription;
  
    public sessionTimeLeftToShow: number;
    public $sessionExpirationTimer: Subscription;
    public $sessionExtend: Subscription;
    public sessionIsExpired: boolean = false;
    private specialCharacterComparator$: specialCharacterComparator = new specialCharacterComparator();


    constructor(
        private router: Router,
        private cmsService: CMSService,
        private _sanitizer: DomSanitizer,
        private _authService: AuthenticationService,
        private _fb: FormBuilder,
        private _dssSelectionService: DssSelectionService,
        private _eppoCodeService: EppoCodeService,
        private _activatedRoute: ActivatedRoute,
        private _logger: NGXLogger,
        private _toastrTranslated: ToastrTranslationService,
        private _countryNamePipe: CountryNamePipe,
        public _modalService: BsModalService
      ) { }
    
    InitPublicPagesEnviroment() : void{

        let cmsService = this.cmsService;
        let promises = [
          // NEW TEMPLATE cmsService.getBanner()
            cmsService.getNewBanner()
            .then((response: any) => { this.bannerUrl = response.image.path }),

          cmsService.getPublicPageFooter()
            .then((footer: any) => {
              let languageFound: boolean = false;
              for (let key in footer) {
                if(key === sessionStorage.getItem("selectedLanguage"))
                {
                  this.footerContent = this._sanitizer.bypassSecurityTrustHtml(footer[key]);
                  languageFound = true;
                  if (footer[key]==="") {
                    this.footerContent = this._sanitizer.bypassSecurityTrustHtml(footer["en"]);
                  }
                }
              }
              if(!languageFound) {
                this.footerContent = this._sanitizer.bypassSecurityTrustHtml(footer["en"]);
              }
            }),
          cmsService.getHomeTitle()
            .then((hTitle: any) => {
              let languageFound: boolean = false;
              for (let key in hTitle) {
                if(key === sessionStorage.getItem("selectedLanguage"))
                {
                  this.homeTitle = hTitle[key];
                  languageFound = true;
                  if (hTitle[key]==="") {
                    this.homeTitle = hTitle["en"];
                  }
                }
              }
              if(!languageFound) {
                this.homeTitle = hTitle["en"];
              }
            }),
          //NEW TEMPLATE cmsService.getPublicPageFooterMiddle()
          cmsService.getEUFlagBanner()
          .then((footerMiddle: any) => {
            let languageFound: boolean = false;
            for (let key in footerMiddle) {
              if(key === sessionStorage.getItem("selectedLanguage"))
              {
                this.footerMiddleContent = this._sanitizer.bypassSecurityTrustHtml(footerMiddle[key]);
                languageFound = true;
                if (footerMiddle[key]==="") {
                  this.footerMiddleContent = this._sanitizer.bypassSecurityTrustHtml(footerMiddle["en"]);
                }
              }
            }
            if(!languageFound) {
              this.footerMiddleContent = this._sanitizer.bypassSecurityTrustHtml(footerMiddle["en"]);
            }
          }),
        ];
        Promise.all(promises).then(() => {
          setTimeout(() => init(), 0)
        })
    }

    checkUserIsLogged(): void{
        // Check if user is logged in
        this.isLoggedIn = this._authService.isLoggedIn();
        // Format the user name
        if(this.isLoggedIn){
          this.$accountSub = this._authService.account$.subscribe(
            (account) => {
              if(account !== null){this.username = (/(.*)@/).exec(account.email)[1];}
            }
          )
          // Start Session timer
          this.oberserableTimer();
        }
    }

    showDSS(): void{

      this._dssSelectionService.getIntegratedValidatedDss().subscribe(

        (response: HttpResponse<DssSelection[]>) => {

            this.integratedDss = response.body;
            if(this.integratedDss.length == 0){
              this._toastrTranslated.showTranslatedToastr("Dss_info_list.Integrated_dss_retrieve_warning_message",
                                                          "Common_labels.Warning",
                                                          "toast-warning");
            }

        },
        (error: HttpErrorResponse) => {

            this._logger.error("Dss models selection error",error);
            this._toastrTranslated.showTranslatedToastr("Dss_info_list.Integrated_dss_retrieve_error_message",
                                                        "Common_labels.Error",
                                                        "toast-error");
        }

      );

      this._dssSelectionService.getExternalValidatedDss().subscribe(

        (response: HttpResponse<DssSelection[]>) => {

            this.externalDss = response.body;
            if(this.externalDss.length == 0){
              this._toastrTranslated.showTranslatedToastr("Dss_info_list.External_dss_retrieve_warning_message",
                                                          "Common_labels.Warning",
                                                          "toast-warning");
            }

        },
        (error: HttpErrorResponse) => {

            this._logger.error("Dss models selection error",error);
            this._toastrTranslated.showTranslatedToastr("Dss_info_list.External_dss_retrieve_error_message",
                                                        "Common_labels.Error",
                                                        "toast-error");
        }

      );

    }
    
    ngOnInit(): void {
        
        home();
        this.InitPublicPagesEnviroment();
        this.checkUserIsLogged();
        this.formInit();

        this._eppoCodeService.cachedRefreshableCrops$.subscribe(data=>{
          this.cropsEppoCodes=data;
          this.cropsEppoCodes = this.cropsEppoCodes.sort(function(a,b){
              return a.text.localeCompare(b.text);
          })
          
          this.cropsEppoCodes = this.specialCharacterComparator$.placeCropsWithSpecialCharactersAtTheBottom(this.cropsEppoCodes)
        });
        this.showDSS()
    }

    formInit() {
        this.selCropForm = this._fb.group({
          cropSelection: this.createCropSelection()
        });
    }
    
    createCropSelection(): FormGroup {
        return this._fb.group({
          cropEppoCode: ["", Validators.required]
        });
    }

    ngOnDestroy(): void {
        if(this.$accountSub){
          this.$accountSub.unsubscribe();
        }
        if (this.$sessionExtend) {
          this.$sessionExtend.unsubscribe();
        }
        if (this.$sessionExpirationTimer) {
          this.$sessionExpirationTimer.unsubscribe();
        }
    }

    goToRegistrationPage() {
        this.router.navigate(['/login'])
          .then(()=>{
            document.getElementById('register-button').click();
          });
    }

    navigateToPrivatePages(): void {
        const userHasDss: boolean = JSON.parse(sessionStorage.getItem("hasDSS"));
        if (userHasDss) {
          this.router.navigate(["/user/dss/dashboard"]);
        } else {
          this.router.navigate(["/user/farm"]);
        }
    }

    private oberserableTimer(): void {
        if (this.$sessionExpirationTimer) {
          this.$sessionExpirationTimer.unsubscribe();
        }
        const source = timer(0, 1000);
        this.$sessionExpirationTimer = source.subscribe(() => {
          this.sessionTimeLeftToShow = this._authService.getExpirationAsSeconds();
          if (this.sessionTimeLeftToShow < 1) {
            this.$sessionExpirationTimer.unsubscribe();
            this.sessionIsExpired = true;
          }
        });
    }


    public isSessionExpiring(): boolean {
        if(this.sessionTimeLeftToShow < 60){
          return true;
        }
        return false;
    }

    public extendSession(): void {
        if (this.$sessionExtend) {
          this.$sessionExtend.unsubscribe();
        }
        this.$sessionExtend = this._authService.authenticateWithRefreshToken(sessionStorage.getItem("refresh_token")).subscribe(()=>{
          this.oberserableTimer();
          this.sessionIsExpired = false;
        });
    }

    
    openModal(template: TemplateRef<any>, size?: string) {
      this.modalRef = this._modalService.show(template, {class: size});
    }

    onConfirmSelectedCrops(): void {
        let cropsSelectedArray: string[] = this.selCropForm.get('cropSelection').get('cropEppoCode').value;
        const crops: string = cropsSelectedArray.join('%2C')
        this._dssSelectionService.getIntegratedDssByMultipleCropsAndPlatformValidated(crops).subscribe(
        (response: HttpResponse<DssSelection[]>) => {
            this.integratedDss = response.body;
            if(this.integratedDss.length > 0) {
            this.areCropsSelected = true;
            
            this._toastrTranslated.showTranslatedToastr("Dss_info_list.Integrated_dss_retrieve_success_message","Common_labels.Success","toast-success");
            } else {
            this.areCropsSelected = false;
            this._toastrTranslated.showTranslatedToastr("Dss_info_list.Integrated_dss_retrieve_warning_message","Common_labels.Warning","toast-warning");
            }
        },
        (error: HttpErrorResponse) => {
            this._logger.error("Dss models selection error",error);
            this._toastrTranslated.showTranslatedToastr("Dss_info_list.Integrated_dss_retrieve_error_message","Common_labels.Error","toast-error");
        }
        );

        this._dssSelectionService.getExternalDssByMultipleCropsAndPlatformValidated(crops).subscribe(
          (response: HttpResponse<DssSelection[]>) => {
              this.externalDss = response.body;
              if(this.externalDss.length > 0) {
              this.areCropsSelected = true;
              
              this._toastrTranslated.showTranslatedToastr("Dss_info_list.External_dss_retrieve_success_message","Common_labels.Success","toast-success");
              } else {
              this.areCropsSelected = false;
              this._toastrTranslated.showTranslatedToastr("Dss_info_list.External_dss_retrieve_warning_message","Common_labels.Warning","toast-warning");
              }
          },
          (error: HttpErrorResponse) => {
              this._logger.error("Dss models selection error",error);
              this._toastrTranslated.showTranslatedToastr("Dss_info_list.External_dss_retrieve_error_message","Common_labels.Error","toast-error");
          }
          );
      this.DssListFiltered = true;
    }

  onDisableFilters(): void{
    this.showDSS();
    this.DssListFiltered = false;
  }

}