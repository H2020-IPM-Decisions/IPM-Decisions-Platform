export interface Field {
  id: string;
  name: string;
  variety: string;
  sowingDate: string;
  cropPest: [
    {
      cropEppoCode: string;
      pestEppoCode: string;
    }
  ];
  fieldCropDto?:any;
}
