import { Link } from "./link.model";
import { Location } from "./location.model";

export interface Farm {
  id: string;
  name: string;
  inf1: string;
  inf2: string;
  location?: Location;
  links?: Link[];
}
