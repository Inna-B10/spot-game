-- DropForeignKey
ALTER TABLE "public"."Stages" DROP CONSTRAINT "Stages_game_id_fkey";

-- AddForeignKey
ALTER TABLE "Stages" ADD CONSTRAINT "Stages_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "Games"("game_id") ON DELETE CASCADE ON UPDATE CASCADE;
