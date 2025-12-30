import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateAppointmentTable1766746858437 implements MigrationInterface {
    name = 'CreateAppointmentTable1766746858437'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('patient', 'doctor', 'admin')`);
        await queryRunner.query(`CREATE TABLE "users" ("user_id" SERIAL NOT NULL, "full_name" character varying(100) NOT NULL, "email" character varying(100) NOT NULL, "password" character varying, "role" "public"."users_role_enum" NOT NULL, "phone" character varying, "age" integer, "gender" character varying, "license_number" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_96aac72f1574b88752e9fb00089" PRIMARY KEY ("user_id"))`);
        await queryRunner.query(`CREATE TYPE "public"."doctor_availability_day_of_week_enum" AS ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday')`);
        await queryRunner.query(`CREATE TABLE "doctor_availability" ("availability_id" SERIAL NOT NULL, "doctor_id" integer NOT NULL, "day_of_week" "public"."doctor_availability_day_of_week_enum" NOT NULL, "start_time" character varying NOT NULL, "end_time" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_3f9a42786501c61a0d314b3e115" PRIMARY KEY ("availability_id"))`);
        await queryRunner.query(`CREATE TABLE "admin_settings" ("setting_id" SERIAL NOT NULL, "key" character varying(50) NOT NULL, "value" character varying(255), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_183ab1d699c433231a67928c766" UNIQUE ("key"), CONSTRAINT "PK_2198b61253ff87e495b80b3c967" PRIMARY KEY ("setting_id"))`);
        await queryRunner.query(`CREATE TABLE "doctor_profiles" ("doctor_id" integer NOT NULL, "specialization" character varying(100) NOT NULL, "consultation_fee" numeric(10,2), "bio" text, "experience_years" integer, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_01939b672a8aebaef6e82fd8ef5" PRIMARY KEY ("doctor_id"))`);
        await queryRunner.query(`CREATE TABLE "doctor_hospitals" ("id" SERIAL NOT NULL, "doctor_id" integer NOT NULL, "hospital_id" integer NOT NULL, CONSTRAINT "PK_c579f7c75a05c3efa435693ea6e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "hospitals" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "address" character varying, CONSTRAINT "PK_02738c80d71453bc3e369a01766" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Migration down method intentionally left empty
        // Tables and data will NOT be dropped on rollback
        console.log('Migration rollback skipped - tables preserved');
    }

}
