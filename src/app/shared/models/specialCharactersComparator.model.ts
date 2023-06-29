import { EppoCode } from "./eppo-code.model";

export class specialCharacterComparator{

    private strangeCharacters: string[] = ["Æ"];


    public placeCropsWithSpecialCharactersAtTheBottom(cropsArray: EppoCode[]){
        let eppoCodesWithStrangeCharacters = cropsArray.filter(cropEppoCode => 
        this.strangeCharacters.includes(cropEppoCode.text.charAt(0)));
      
        let eppoCodesWithoutStrangeCharacters = cropsArray.filter(cropEppoCode => 
        !(eppoCodesWithStrangeCharacters.includes(cropEppoCode)))
            
        return eppoCodesWithoutStrangeCharacters.concat(eppoCodesWithStrangeCharacters)
    }
}