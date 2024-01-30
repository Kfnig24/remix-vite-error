
SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

CREATE EXTENSION IF NOT EXISTS "pg_net" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgsodium" WITH SCHEMA "pgsodium";

CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";

CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";

SET default_tablespace = '';

SET default_table_access_method = "heap";

CREATE TABLE IF NOT EXISTS "public"."clients" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "address" "text" NOT NULL,
    "city" "text" NOT NULL,
    "first_name" "text" NOT NULL,
    "last_name" "text" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "registery_id" bigint NOT NULL
);

ALTER TABLE "public"."clients" OWNER TO "postgres";

ALTER TABLE "public"."clients" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."clients_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."jobs" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "title" "text" NOT NULL,
    "description" "text" NOT NULL,
    "categorie" "text" NOT NULL,
    "date" timestamp without time zone NOT NULL,
    "completed" boolean DEFAULT false NOT NULL,
    "paid" boolean DEFAULT false NOT NULL,
    "author" "uuid" NOT NULL
);

ALTER TABLE "public"."jobs" OWNER TO "postgres";

ALTER TABLE "public"."jobs" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."jobs_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."propositions" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "job" bigint NOT NULL,
    "user_id" "uuid" NOT NULL,
    "teen" bigint NOT NULL,
    "accepted" boolean DEFAULT false NOT NULL,
    "client_id" "uuid" NOT NULL
);

ALTER TABLE "public"."propositions" OWNER TO "postgres";

ALTER TABLE "public"."propositions" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."propositions_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."teens" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "first_name" "text" NOT NULL,
    "last_name" "text" NOT NULL,
    "birthdate" "date" NOT NULL,
    "note" smallint DEFAULT '5'::smallint NOT NULL,
    "paid" boolean DEFAULT false NOT NULL,
    "user_id" "uuid" NOT NULL,
    "stripe_id" "text",
    "registery_id" bigint NOT NULL
);

ALTER TABLE "public"."teens" OWNER TO "postgres";

ALTER TABLE "public"."teens" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."teens_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."users" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "account_type" "text" NOT NULL
);

ALTER TABLE "public"."users" OWNER TO "postgres";

ALTER TABLE "public"."users" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."users_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

ALTER TABLE ONLY "public"."clients"
    ADD CONSTRAINT "clients_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."clients"
    ADD CONSTRAINT "clients_registery_id_key" UNIQUE ("registery_id");

ALTER TABLE ONLY "public"."clients"
    ADD CONSTRAINT "clients_user_id_key" UNIQUE ("user_id");

ALTER TABLE ONLY "public"."jobs"
    ADD CONSTRAINT "jobs_id_key" UNIQUE ("id");

ALTER TABLE ONLY "public"."jobs"
    ADD CONSTRAINT "jobs_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."propositions"
    ADD CONSTRAINT "propositions_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."teens"
    ADD CONSTRAINT "teens_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."teens"
    ADD CONSTRAINT "teens_registery_id_key" UNIQUE ("registery_id");

ALTER TABLE ONLY "public"."teens"
    ADD CONSTRAINT "teens_stripe_id_key" UNIQUE ("stripe_id");

ALTER TABLE ONLY "public"."teens"
    ADD CONSTRAINT "teens_user_id_key" UNIQUE ("user_id");

ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_user_id_key" UNIQUE ("user_id");

ALTER TABLE ONLY "public"."clients"
    ADD CONSTRAINT "clients_registery_id_fkey" FOREIGN KEY ("registery_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."clients"
    ADD CONSTRAINT "clients_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."jobs"
    ADD CONSTRAINT "jobs_author_fkey" FOREIGN KEY ("author") REFERENCES "auth"."users"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."propositions"
    ADD CONSTRAINT "propositions_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."propositions"
    ADD CONSTRAINT "propositions_job_fkey" FOREIGN KEY ("job") REFERENCES "public"."jobs"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."propositions"
    ADD CONSTRAINT "propositions_teen_fkey" FOREIGN KEY ("teen") REFERENCES "public"."teens"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."propositions"
    ADD CONSTRAINT "propositions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."teens"
    ADD CONSTRAINT "teens_registery_id_fkey" FOREIGN KEY ("registery_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."teens"
    ADD CONSTRAINT "teens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;

CREATE POLICY "Only authenticated use can insert their own row" ON "public"."teens" FOR INSERT TO "authenticated" WITH CHECK (("auth"."uid"() = "user_id"));

CREATE POLICY "Only authenticated use can update their jobs" ON "public"."jobs" FOR UPDATE TO "authenticated" USING (true) WITH CHECK (("auth"."uid"() = "author"));

CREATE POLICY "Only authenticated user can create jobs" ON "public"."jobs" FOR INSERT TO "authenticated" WITH CHECK (("auth"."uid"() = "author"));

CREATE POLICY "Only authenticated user can create their own row" ON "public"."users" FOR INSERT TO "authenticated" WITH CHECK (("auth"."uid"() = "user_id"));

CREATE POLICY "Only authenticated user can delete their jobs" ON "public"."jobs" FOR DELETE TO "authenticated" USING (("auth"."uid"() = "author"));

CREATE POLICY "Only authenticated user can delete their own row" ON "public"."clients" FOR DELETE TO "authenticated" USING (("auth"."uid"() = "user_id"));

CREATE POLICY "Only authenticated user can delete their own row" ON "public"."teens" FOR DELETE TO "authenticated" USING (("auth"."uid"() = "user_id"));

CREATE POLICY "Only authenticated user can delete their own row" ON "public"."users" FOR DELETE TO "authenticated" USING (("auth"."uid"() = "user_id"));

CREATE POLICY "Only authenticated user can insert their own row" ON "public"."clients" FOR INSERT TO "authenticated" WITH CHECK (("auth"."uid"() = "user_id"));

CREATE POLICY "Only authenticated user can see" ON "public"."clients" FOR SELECT TO "authenticated" USING (true);

CREATE POLICY "Only authenticated user can see" ON "public"."jobs" FOR SELECT TO "authenticated" USING (true);

CREATE POLICY "Only authenticated user can see" ON "public"."teens" FOR SELECT TO "authenticated" USING (true);

CREATE POLICY "Only authenticated user can see" ON "public"."users" FOR SELECT TO "authenticated" USING (true);

CREATE POLICY "Only authenticated user can update" ON "public"."teens" FOR UPDATE TO "authenticated" USING (true) WITH CHECK (true);

CREATE POLICY "Only authenticated user can update their own row" ON "public"."clients" FOR UPDATE TO "authenticated" USING (true) WITH CHECK (("auth"."uid"() = "user_id"));

CREATE POLICY "Only authenticated user can update their own row" ON "public"."users" FOR UPDATE TO "authenticated" USING (true) WITH CHECK (("auth"."uid"() = "user_id"));

CREATE POLICY "Only the author of the job or the teen can see" ON "public"."propositions" FOR SELECT TO "authenticated" USING ((("auth"."uid"() = "client_id") OR ("auth"."uid"() = "user_id")));

CREATE POLICY "Only the client or the teen can update" ON "public"."propositions" FOR UPDATE TO "authenticated" USING ((("auth"."uid"() = "user_id") OR ("auth"."uid"() = "client_id"))) WITH CHECK ((("auth"."uid"() = "user_id") OR ("auth"."uid"() = "client_id")));

CREATE POLICY "Only the teen can create a proposition" ON "public"."propositions" FOR INSERT TO "authenticated" WITH CHECK (("auth"."uid"() = "user_id"));

CREATE POLICY "Only the teen can delete" ON "public"."propositions" FOR DELETE TO "authenticated" USING (("auth"."uid"() = "user_id"));

ALTER TABLE "public"."clients" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."jobs" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."propositions" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."teens" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."users" ENABLE ROW LEVEL SECURITY;

GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

GRANT ALL ON TABLE "public"."clients" TO "anon";
GRANT ALL ON TABLE "public"."clients" TO "authenticated";
GRANT ALL ON TABLE "public"."clients" TO "service_role";

GRANT ALL ON SEQUENCE "public"."clients_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."clients_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."clients_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."jobs" TO "anon";
GRANT ALL ON TABLE "public"."jobs" TO "authenticated";
GRANT ALL ON TABLE "public"."jobs" TO "service_role";

GRANT ALL ON SEQUENCE "public"."jobs_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."jobs_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."jobs_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."propositions" TO "anon";
GRANT ALL ON TABLE "public"."propositions" TO "authenticated";
GRANT ALL ON TABLE "public"."propositions" TO "service_role";

GRANT ALL ON SEQUENCE "public"."propositions_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."propositions_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."propositions_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."teens" TO "anon";
GRANT ALL ON TABLE "public"."teens" TO "authenticated";
GRANT ALL ON TABLE "public"."teens" TO "service_role";

GRANT ALL ON SEQUENCE "public"."teens_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."teens_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."teens_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."users" TO "anon";
GRANT ALL ON TABLE "public"."users" TO "authenticated";
GRANT ALL ON TABLE "public"."users" TO "service_role";

GRANT ALL ON SEQUENCE "public"."users_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."users_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."users_id_seq" TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";

RESET ALL;
