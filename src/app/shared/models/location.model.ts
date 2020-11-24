import { Address } from "./address.model";

export interface Location {
  x: number;
  y: number;
  srid: number;
  address?: Address;
}
