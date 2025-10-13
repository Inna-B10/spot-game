-- CreateTable
CREATE TABLE "Game" (
    "game_id" SERIAL NOT NULL,
    "game_title" TEXT NOT NULL,
    "game_desc" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("game_id")
);

-- CreateTable
CREATE TABLE "Level" (
    "level_id" SERIAL NOT NULL,
    "gameId" INTEGER NOT NULL,
    "image_name" TEXT NOT NULL,
    "image_path" TEXT NOT NULL,
    "difficulty" TEXT,
    "areas" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Level_pkey" PRIMARY KEY ("level_id")
);

-- AddForeignKey
ALTER TABLE "Level" ADD CONSTRAINT "Level_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("game_id") ON DELETE RESTRICT ON UPDATE CASCADE;
