/*
  Warnings:

  - You are about to drop the `Levels` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Levels" DROP CONSTRAINT "Levels_game_id_fkey";

-- DropTable
DROP TABLE "public"."Levels";

-- CreateTable
CREATE TABLE "Stages" (
    "stage_id" SERIAL NOT NULL,
    "game_id" INTEGER NOT NULL,
    "stage_slug" TEXT NOT NULL,
    "image_path" TEXT NOT NULL,
    "stage_task" TEXT,
    "difficulty" TEXT,
    "areas" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Stages_pkey" PRIMARY KEY ("stage_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Stages_stage_slug_key" ON "Stages"("stage_slug");

-- AddForeignKey
ALTER TABLE "Stages" ADD CONSTRAINT "Stages_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "Games"("game_id") ON DELETE RESTRICT ON UPDATE CASCADE;
