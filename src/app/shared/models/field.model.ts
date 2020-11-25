import { Link } from "./link.model";

export interface Field {
  id: string;
  name: string;
  inf1: string;
  inf2: string;
  cropPests?: [
    {
      cropEppoCode: string;
      pestEppoCode: string;
    }
  ];
}
