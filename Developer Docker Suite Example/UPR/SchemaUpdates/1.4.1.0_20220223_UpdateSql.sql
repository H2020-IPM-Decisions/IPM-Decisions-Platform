ALTER TABLE public."Field"
    ADD COLUMN "Location" geometry;

ALTER TABLE public."FieldDssResult"
    ALTER COLUMN "WarningStatus" DROP NOT NULL;