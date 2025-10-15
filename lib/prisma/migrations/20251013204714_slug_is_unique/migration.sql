/*
  Warnings:

  - A unique constraint covering the columns `[level_slug]` on the table `Levels` will be added. If there are existing duplicate values, this will fail.
  - Made the column `game_slug` on table `Games` required. This step will fail if there are existing NULL values in that column.
  - Made the column `level_slug` on table `Levels` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Games" ALTER COLUMN "game_slug" SET NOT NULL;

-- AlterTable
ALTER TABLE "Levels" ALTER COLUMN "level_slug" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Levels_level_slug_key" ON "Levels"("level_slug");
