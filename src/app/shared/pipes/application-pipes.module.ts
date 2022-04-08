import { CommonModule } from "@angular/common";
import { ModuleWithProviders, NgModule } from "@angular/core";
import { CmsLinkPipe } from "./cms-link.pipe";
import { EppoCodePipe } from "./eppo-code.pipe";
import { CountryAlpha2CodePipe } from "./country-alpha2-code.pipe";

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        CmsLinkPipe,
        EppoCodePipe,
        CountryAlpha2CodePipe
    ],
    exports: [
        CmsLinkPipe,
        EppoCodePipe,
        CountryAlpha2CodePipe
    ]
})
export class ApplicationPipesModule {
    // found helpful: https://stackoverflow.com/questions/42576420/how-to-declare-a-pipe-globally-to-use-in-different-modules
    static forRoot(): ModuleWithProviders {
        return {
          ngModule: ApplicationPipesModule,
          providers: [ ]
        };
      }
 }