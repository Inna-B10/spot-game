/*
  Warnings:

  - You are about to drop the `Game` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Level` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Level" DROP CONSTRAINT "Level_gameId_fkey";

-- DropTable
DROP TABLE "public"."Game";

-- DropTable
DROP TABLE "public"."Level";

-- CreateTable
CREATE TABLE "Games" (
    "game_id" SERIAL NOT NULL,
    "game_title" TEXT NOT NULL,
    "game_desc" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Games_pkey" PRIMARY KEY ("game_id")
);

-- CreateTable
CREATE TABLE "Levels" (
    "level_id" SERIAL NOT NULL,
    "game_id" INTEGER NOT NULL,
    "image_name" TEXT NOT NULL,
    "image_path" TEXT NOT NULL,
    "difficulty" TEXT,
    "areas" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Levels_pkey" PRIMARY KEY ("level_id")
);

-- AddForeignKey
ALTER TABLE "Levels" ADD CONSTRAINT "Levels_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "Games"("game_id") ON DELETE RESTRICT ON UPDATE CASCADE;
