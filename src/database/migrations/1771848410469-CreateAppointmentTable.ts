import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateAppointmentTable1771848410469 implements MigrationInterface {
    name = 'CreateAppointmentTable1771848410469'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('patient', 'doctor', 'admin')`);
        await queryRunner.query(`CREATE TABLE "users" ("user_id" SERIAL NOT NULL, "full_name" character varying(100) NOT NULL, "email" character varying(100) NOT NULL, "password" character varying, "role" "public"."users_role_enum" NOT NULL, "phone" character varying, "age" integer, "gender" character varying, "license_number" character varying, "date_of_birth" date, "address" text, "blood_group" character varying, "education" text, "experience" integer, "consultation_fee" numeric(10,2), "bio" text, "available_hours" character varying, "profile_picture" text, "google_id" character varying, "reset_token" character varying, "reset_token_exp" TIMESTAMP, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_96aac72f1574b88752e9fb00089" PRIMARY KEY ("user_id"))`);
        await queryRunner.query(`CREATE TABLE "notifications" ("id" SERIAL NOT NULL, "user_id" integer NOT NULL, "title" character varying NOT NULL, "message" character varying NOT NULL, "is_read" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "appointment_id" integer, CONSTRAINT "PK_6a72c3c0f683f6462415e653c3a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."appointments_status_enum" AS ENUM('scheduled', 'completed', 'cancelled', 'confirmed', 'rescheduled')`);
        await queryRunner.query(`CREATE TABLE "appointments" ("appointment_id" SERIAL NOT NULL, "doctor_id" integer NOT NULL, "patient_id" integer NOT NULL, "appointment_date" date NOT NULL, "start_time" character varying NOT NULL, "end_time" character varying NOT NULL, "status" "public"."appointments_status_enum" NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_dde485d1b7ca51845c075befb6b" PRIMARY KEY ("appointment_id"))`);
        await queryRunner.query(`CREATE TYPE "public"."appointment_history_old_status_enum" AS ENUM('scheduled', 'completed', 'cancelled', 'confirmed', 'rescheduled')`);
        await queryRunner.query(`CREATE TYPE "public"."appointment_history_new_status_enum" AS ENUM('scheduled', 'completed', 'cancelled', 'confirmed', 'rescheduled')`);
        await queryRunner.query(`CREATE TABLE "appointment_history" ("history_id" SERIAL NOT NULL, "appointment_id" integer NOT NULL, "changed_by" integer, "old_status" "public"."appointment_history_old_status_enum", "new_status" "public"."appointment_history_new_status_enum" NOT NULL, "change_reason" character varying, "changed_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_c45abbf091def5f9656b1e2ecc2" PRIMARY KEY ("history_id"))`);
        await queryRunner.query(`ALTER TABLE "notifications" ADD CONSTRAINT "FK_9e2d01428faefb60e63c287c04a" FOREIGN KEY ("appointment_id") REFERENCES "appointments"("appointment_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "appointments" ADD CONSTRAINT "FK_3330f054416745deaa2cc130700" FOREIGN KEY ("patient_id") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "appointments" ADD CONSTRAINT "FK_4cf26c3f972d014df5c68d503d2" FOREIGN KEY ("doctor_id") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "appointment_history" ADD CONSTRAINT "FK_492bdb7d7fff7082d957ad2757a" FOREIGN KEY ("appointment_id") REFERENCES "appointments"("appointment_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        console.log('Reverting migration: CreateAppointmentTable1771848410469');
    }

}
