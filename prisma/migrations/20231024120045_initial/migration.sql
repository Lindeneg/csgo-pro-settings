-- CreateTable
CREATE TABLE "Player" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataSubmittedAt" DATETIME,
    "foundFromTeam" TEXT,
    "mouse" TEXT,
    "monitor" TEXT,
    "scaling" INTEGER,
    "resolution" TEXT,
    "href" TEXT,
    "refreshRate" INTEGER,
    "eDpi" INTEGER,
    "dpi" INTEGER,
    "pollingRate" INTEGER,
    "sensitivity" REAL,
    "zoomSensitivity" REAL,
    "rawInput" BOOLEAN,
    "playerSubmitted" BOOLEAN
);

-- CreateIndex
CREATE UNIQUE INDEX "Player_name_key" ON "Player"("name");
