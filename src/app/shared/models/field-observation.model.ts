import { Location } from "./location.model";
export interface FieldObservation {
  id: string;
  location: Location;
  time: string;
  pestEppoCode: string;
  cropEppoCode: string;
}
