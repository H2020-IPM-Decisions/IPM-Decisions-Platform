ALTER TABLE public."CropPestDss"
ADD COLUMN "DssModelVersion" TEXT;

UPDATE public."CropPestDss" SET "DssModelVersion" = "DssVersion";

DROP INDEX "IX_CropPestDss_CropPestId_DssId_DssModelId_DssVersion_DssExecu~";

ALTER TABLE public."CropPestDss" DROP COLUMN "DssVersion";

CREATE UNIQUE INDEX "IX_CropPestDss_All"
    ON public."CropPestDss" USING btree
    ("CropPestId" ASC NULLS LAST, "DssId" COLLATE pg_catalog."default" ASC NULLS LAST, 
    "DssModelId" COLLATE pg_catalog."default" ASC NULLS LAST, 
    "DssModelVersion" COLLATE pg_catalog."default" ASC NULLS LAST, 
    "DssExecutionType" COLLATE pg_catalog."default" ASC NULLS LAST);