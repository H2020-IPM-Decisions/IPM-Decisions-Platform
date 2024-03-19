ALTER TABLE public."FieldCropPestDss"
    ADD COLUMN "CustomName" text;
ALTER TABLE public."FieldCropPestDss"
    ADD COLUMN "IsCustomDss" boolean NOT NULL DEFAULT false;

DROP INDEX IF EXISTS public."IX_FieldCropPestDss_FieldCropPestId_CropPestDssId";

CREATE UNIQUE INDEX IF NOT EXISTS "IX_FieldCropPestDss_FieldCropPestId_CropPestDssId_IsCustomDss_~"
    ON public."FieldCropPestDss" USING btree
    ("FieldCropPestId" ASC NULLS LAST, "CropPestDssId" ASC NULLS LAST, "IsCustomDss" ASC NULLS LAST, "CustomName" COLLATE pg_catalog."default" ASC NULLS LAST)
    TABLESPACE pg_default;