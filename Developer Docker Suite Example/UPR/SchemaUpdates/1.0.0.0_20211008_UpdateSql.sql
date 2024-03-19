ALTER TABLE public."CropPestDss"
ADD COLUMN "DssVersion" TEXT
NOT NULL DEFAULT '';

DROP INDEX public."IX_CropPestDss_All";

CREATE UNIQUE INDEX "IX_CropPestDss_All"
    ON public."CropPestDss" USING btree
    ("CropPestId" ASC NULLS LAST, 
    "DssId" COLLATE pg_catalog."default" ASC NULLS LAST, 
    "DssVersion" COLLATE pg_catalog."default" ASC NULLS LAST, 
    "DssModelId" COLLATE pg_catalog."default" ASC NULLS LAST, 
    "DssModelVersion" COLLATE pg_catalog."default" ASC NULLS LAST, 
    "DssExecutionType" COLLATE pg_catalog."default" ASC NULLS LAST);