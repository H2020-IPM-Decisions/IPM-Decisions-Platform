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
import Map from 'ol/Map';
import OSM from 'ol/source/OSM';
import View from 'ol/View';
import ImageWMS from 'ol/source/ImageWMS.js';
import proj4 from 'proj4';
import Projection from 'ol/proj/Projection.js';
import { register } from 'ol/proj/proj4';
import { Image as ImageLayer, Tile as TileLayer } from 'ol/layer.js';

declare var init: any;
declare var home: any;

@Component({
    selector: 'risk-map',
    templateUrl: './risk-map.component.html',
    styleUrls: ['./risk-map.component.css', '../home/./style.css'],
})
export class RiskMapComponent implements OnInit {

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
    public map: Map;


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
          cmsService.getBanner()
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
          cmsService.getPublicPageFooterMiddle()
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
    
    ngOnInit(): void {
        
        home();
        this.InitPublicPagesEnviroment();
        this.checkUserIsLogged();
        this.formInit();

        this._eppoCodeService.cachedRefreshableCropsOnTheFly$.subscribe(data=>{
          this.cropsEppoCodes=data;
          this.cropsEppoCodes = this.cropsEppoCodes.sort(function(a,b){
              return a.text.localeCompare(b.text);
          })
          
          this.cropsEppoCodes = this.specialCharacterComparator$.placeCropsWithSpecialCharactersAtTheBottom(this.cropsEppoCodes)
        });

        proj4.defs(
          'EPSG:25833',
          '+proj=utm +zone=33 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs'
        );
        register(proj4);
        this.initializeMap();
    }

    initializeMap() {
      const projection = new Projection({
        code: 'EPSG:25833',
      });
      const layers = [
        new TileLayer({
          source: new OSM(),
        }),
        new ImageLayer({
          source: new ImageWMS({
            url: 'https://testvips.nibio.no/cgi-bin/PSILARTEMP',
            params: { LAYERS: 'PSILARTEMP_TODAY', TRANSPARENT: 'TRUE' },
            ratio: 1,
            serverType: 'mapserver',
            projection: projection,
          }),
        }),
      ];
  
      this.map = new Map({
        target: 'map',
        layers: layers,
        controls: [],
        view: new View({
          center: [455109.15554, 7162668.726335],
          zoom: 4,
        }),
      });
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
}