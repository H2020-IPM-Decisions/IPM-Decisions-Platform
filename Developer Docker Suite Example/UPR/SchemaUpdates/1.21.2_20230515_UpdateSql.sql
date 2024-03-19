CREATE TABLE public."DisabledDss" (
    "Id" uuid NOT NULL,
    "DssId" text NOT NULL,
    "DssVersion" text NOT NULL,
    "DssModelId" text NOT NULL,
    "DssModelVersion" text NOT NULL
);

ALTER TABLE ONLY public."DisabledDss"
    ADD CONSTRAINT "PK_DisabledDss" PRIMARY KEY ("Id");