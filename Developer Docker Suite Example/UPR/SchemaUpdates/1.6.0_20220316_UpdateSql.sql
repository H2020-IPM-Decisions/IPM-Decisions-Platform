ALTER TABLE public."Field"
    ALTER COLUMN "Location" TYPE geometry(point);
	
ALTER TABLE public."FieldCropPestDss"
    ADD COLUMN "LastJobId" text;