export interface Field {
  id: string;
  name: string;
  sowingDate: string;
  cropPest: [
    {
      cropEppoCode: string;
      pestEppoCode: string;
    }
  ];
  fieldCropDto?:any;
  variety?: string;
}
