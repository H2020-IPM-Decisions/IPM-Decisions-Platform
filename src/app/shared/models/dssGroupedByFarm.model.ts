import { IDssFlat } from './../../user/components/dss/dss-selection.model';

export class DssGroupedByFarm {
    constructor(
        public farmId: string,
        public farmName: string,
        public groupedByCrops: DssGroupedByCrops[]
    ){}
}

export class DssGroupedByCrops {
    constructor(
        public eppoCode: string,
        public dssModels: IDssFlat[]
    ){}
}