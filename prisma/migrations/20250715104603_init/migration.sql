-- CreateTable
CREATE TABLE "trip_days" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "date" DATETIME NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "songTitle" TEXT NOT NULL,
    "songArtist" TEXT NOT NULL,
    "songLyrics" TEXT NOT NULL,
    "spotifyUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "trip_days_date_key" ON "trip_days"("date");
