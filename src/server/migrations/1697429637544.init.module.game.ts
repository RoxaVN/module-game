import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitModuleGame1697429637544 implements MigrationInterface {
  name = 'InitModuleGame1697429637544';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE "user_game_room" (
          "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
          "userId" uuid NOT NULL,
          "game" character varying(256) NOT NULL,
          "gameRoomId" uuid NOT NULL,
          "metadata" jsonb,
          "updatedDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
          CONSTRAINT "UQ_eb91f0ad6b9295d8af72c4dfec1" UNIQUE ("userId", "gameRoomId"),
          CONSTRAINT "PK_66f5a2d3bf9dc6bd5d55ade7d04" PRIMARY KEY ("id")
        )
        `);
    await queryRunner.query(`
        CREATE INDEX "IDX_3be60abf54bac3a3f1f93363e5" ON "user_game_room" ("userId")
        `);
    await queryRunner.query(`
        CREATE TABLE "game_room" (
          "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
          "userId" uuid,
          "game" character varying(256) NOT NULL,
          "maxUsers" integer NOT NULL DEFAULT '0',
          "userCount" integer NOT NULL DEFAULT '0',
          "name" character varying(256) NOT NULL DEFAULT '',
          "mode" text NOT NULL DEFAULT 'default',
          "private" boolean NOT NULL DEFAULT false,
          "locked" boolean NOT NULL DEFAULT false,
          "metadata" jsonb,
          "createdDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
          "updatedDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
          CONSTRAINT "PK_fa4083cccb79a3e4786a991000b" PRIMARY KEY ("id")
        )
        `);
    await queryRunner.query(`
        CREATE INDEX "IDX_2d3b5dc1ede82966ce4a2acc57" ON "game_room" ("userId")
        `);
    await queryRunner.query(`
        CREATE INDEX "IDX_1bcab30fbfe5cb83c8b2c065f4" ON "game_room" ("game")
        `);
    await queryRunner.query(`
        ALTER TABLE "user_game_room"
        ADD CONSTRAINT "FK_81f476301e073a1aff781c16a61" FOREIGN KEY ("gameRoomId") REFERENCES "game_room"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE "user_game_room" DROP CONSTRAINT "FK_81f476301e073a1aff781c16a61"
        `);
    await queryRunner.query(`
        DROP INDEX "public"."IDX_1bcab30fbfe5cb83c8b2c065f4"
        `);
    await queryRunner.query(`
        DROP INDEX "public"."IDX_2d3b5dc1ede82966ce4a2acc57"
        `);
    await queryRunner.query(`
        DROP TABLE "game_room"
        `);
    await queryRunner.query(`
        DROP INDEX "public"."IDX_3be60abf54bac3a3f1f93363e5"
        `);
    await queryRunner.query(`
        DROP TABLE "user_game_room"
        `);
  }
}
