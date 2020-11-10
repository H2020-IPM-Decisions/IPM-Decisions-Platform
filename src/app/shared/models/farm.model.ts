import { FarmLocation } from "./farm-location.model";

export interface FarmModel {
  id: string,
  name: string;
  inf1: string;
  inf2?: string;
  location?: FarmLocation;
}
