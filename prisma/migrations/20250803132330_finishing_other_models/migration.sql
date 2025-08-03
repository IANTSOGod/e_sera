/*
  Warnings:

  - The values [FACEBOOK,TWITTER] on the enum `Provider` will be removed. If these variants are still used in the database, this will fail.

*/
-- CreateEnum
CREATE TYPE "Reacttype" AS ENUM ('LIKE', 'DISLIKE', 'HAHA', 'LOVE', 'SAD');

-- AlterEnum
BEGIN;
CREATE TYPE "Provider_new" AS ENUM ('GOOGLE', 'EMAIL', 'GITHUB');
ALTER TABLE "User" ALTER COLUMN "provider" TYPE "Provider_new" USING ("provider"::text::"Provider_new");
ALTER TYPE "Provider" RENAME TO "Provider_old";
ALTER TYPE "Provider_new" RENAME TO "Provider";
DROP TYPE "Provider_old";
COMMIT;

-- CreateTable
CREATE TABLE "Publication" (
    "id" TEXT NOT NULL,
    "creator_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Publication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Photos" (
    "id" TEXT NOT NULL,
    "uploader_id" TEXT NOT NULL,
    "photo_link" TEXT NOT NULL,

    CONSTRAINT "Photos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "pub_id" TEXT NOT NULL,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reaction" (
    "id" TEXT NOT NULL,
    "type" "Reacttype" NOT NULL,
    "reactor_id" TEXT NOT NULL,

    CONSTRAINT "Reaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pub_reaction" (
    "id" TEXT NOT NULL,
    "pub_id" TEXT NOT NULL,
    "react_id" TEXT NOT NULL,

    CONSTRAINT "Pub_reaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Partage" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "pub_id" TEXT NOT NULL,

    CONSTRAINT "Partage_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Publication" ADD CONSTRAINT "Publication_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Photos" ADD CONSTRAINT "Photos_uploader_id_fkey" FOREIGN KEY ("uploader_id") REFERENCES "Publication"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_pub_id_fkey" FOREIGN KEY ("pub_id") REFERENCES "Publication"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reaction" ADD CONSTRAINT "Reaction_reactor_id_fkey" FOREIGN KEY ("reactor_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pub_reaction" ADD CONSTRAINT "Pub_reaction_pub_id_fkey" FOREIGN KEY ("pub_id") REFERENCES "Publication"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pub_reaction" ADD CONSTRAINT "Pub_reaction_react_id_fkey" FOREIGN KEY ("react_id") REFERENCES "Reaction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Partage" ADD CONSTRAINT "Partage_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Partage" ADD CONSTRAINT "Partage_pub_id_fkey" FOREIGN KEY ("pub_id") REFERENCES "Publication"("id") ON DELETE CASCADE ON UPDATE CASCADE;
