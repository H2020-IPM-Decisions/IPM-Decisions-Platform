export interface Field {
  id: string;
  name: string;
  inf1: string;
  inf2: string;
  cropPest: [
    {
      cropEppoCode: string;
      pestEppoCode: string;
    }
  ];
}
