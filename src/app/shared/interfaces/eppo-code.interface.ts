export interface IEppoCode {
    eppoCodeType:string;
    eppoCodesDto:IEppoCodesDto[];
}

export interface IEppoCodesDto {
    eppoCode:string;
    languages:ILanguages;
}

//Language for crop/pest names, prefer the language of the logged user.
//If the user language have no value then use the latin value.
export interface ILanguages {
    en:string; //English
    la:string; //Latin
}