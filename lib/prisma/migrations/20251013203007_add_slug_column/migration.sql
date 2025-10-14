/*
  Warnings:

  - You are about to drop the column `image_name` on the `Levels` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[game_slug]` on the table `Games` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Games" ADD COLUMN     "game_slug" TEXT;

-- AlterTable
ALTER TABLE "Levels" DROP COLUMN "image_name",
ADD COLUMN     "level_slug" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Games_game_slug_key" ON "Games"("game_slug");
