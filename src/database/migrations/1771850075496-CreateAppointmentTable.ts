import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateAppointmentTable1771850075496 implements MigrationInterface {
    name = 'CreateAppointmentTable1771850075496'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "notifications" ("id" SERIAL NOT NULL, "user_id" integer NOT NULL, "title" character varying NOT NULL, "message" character varying NOT NULL, "is_read" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "appointment_id" integer, CONSTRAINT "PK_6a72c3c0f683f6462415e653c3a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "appointments" ("appointment_id" SERIAL NOT NULL, "doctor_id" integer NOT NULL, "patient_id" integer NOT NULL, "appointment_date" date NOT NULL, "start_time" character varying NOT NULL, "end_time" character varying NOT NULL, "status" "public"."appointments_status_enum" NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_dde485d1b7ca51845c075befb6b" PRIMARY KEY ("appointment_id"))`);
        await queryRunner.query(`CREATE TYPE "public"."appointment_history_old_status_enum" AS ENUM('scheduled', 'completed', 'cancelled', 'confirmed', 'rescheduled')`);
        await queryRunner.query(`CREATE TYPE "public"."appointment_history_new_status_enum" AS ENUM('scheduled', 'completed', 'cancelled', 'confirmed', 'rescheduled')`);
        await queryRunner.query(`CREATE TABLE "appointment_history" ("history_id" SERIAL NOT NULL, "appointment_id" integer NOT NULL, "changed_by" integer, "old_status" "public"."appointment_history_old_status_enum", "new_status" "public"."appointment_history_new_status_enum" NOT NULL, "change_reason" character varying, "changed_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_c45abbf091def5f9656b1e2ecc2" PRIMARY KEY ("history_id"))`);
        await queryRunner.query(`ALTER TABLE "users" ADD "phone" character varying`);
        await queryRunner.query(`ALTER TABLE "users" ADD "age" integer`);
        await queryRunner.query(`ALTER TABLE "users" ADD "gender" character varying`);
        await queryRunner.query(`ALTER TABLE "users" ADD "license_number" character varying`);
        await queryRunner.query(`ALTER TABLE "users" ADD "date_of_birth" date`);
        await queryRunner.query(`ALTER TABLE "users" ADD "address" text`);
        await queryRunner.query(`ALTER TABLE "users" ADD "blood_group" character varying`);
        await queryRunner.query(`ALTER TABLE "users" ADD "education" text`);
        await queryRunner.query(`ALTER TABLE "users" ADD "experience" integer`);
        await queryRunner.query(`ALTER TABLE "users" ADD "consultation_fee" numeric(10,2)`);
        await queryRunner.query(`ALTER TABLE "users" ADD "bio" text`);
        await queryRunner.query(`ALTER TABLE "users" ADD "available_hours" character varying`);
        await queryRunner.query(`ALTER TABLE "users" ADD "profile_picture" text`);
        await queryRunner.query(`ALTER TABLE "users" ADD "google_id" character varying`);
        await queryRunner.query(`ALTER TABLE "users" ADD "reset_token" character varying`);
        await queryRunner.query(`ALTER TABLE "users" ADD "reset_token_exp" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "notifications" ADD CONSTRAINT "FK_9e2d01428faefb60e63c287c04a" FOREIGN KEY ("appointment_id") REFERENCES "appointments"("appointment_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "appointments" ADD CONSTRAINT "FK_3330f054416745deaa2cc130700" FOREIGN KEY ("patient_id") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "appointments" ADD CONSTRAINT "FK_4cf26c3f972d014df5c68d503d2" FOREIGN KEY ("doctor_id") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "appointment_history" ADD CONSTRAINT "FK_492bdb7d7fff7082d957ad2757a" FOREIGN KEY ("appointment_id") REFERENCES "appointments"("appointment_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "appointment_history" DROP CONSTRAINT "FK_492bdb7d7fff7082d957ad2757a"`);
        await queryRunner.query(`ALTER TABLE "appointments" DROP CONSTRAINT "FK_4cf26c3f972d014df5c68d503d2"`);
        await queryRunner.query(`ALTER TABLE "appointments" DROP CONSTRAINT "FK_3330f054416745deaa2cc130700"`);
        await queryRunner.query(`ALTER TABLE "notifications" DROP CONSTRAINT "FK_9e2d01428faefb60e63c287c04a"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "reset_token_exp"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "reset_token"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "google_id"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "profile_picture"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "available_hours"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "bio"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "consultation_fee"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "experience"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "education"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "blood_group"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "address"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "date_of_birth"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "license_number"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "gender"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "age"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "phone"`);
        await queryRunner.query(`DROP TABLE "appointment_history"`);
        await queryRunner.query(`DROP TYPE "public"."appointment_history_new_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."appointment_history_old_status_enum"`);
        await queryRunner.query(`DROP TABLE "appointments"`);
        await queryRunner.query(`DROP TABLE "notifications"`);
    }

}
