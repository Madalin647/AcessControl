/*
  Warnings:

  - You are about to drop the column `invites` on the `Project` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "InviteStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "invites";

-- CreateTable
CREATE TABLE "ProjectMember" (
    "id" SERIAL NOT NULL,
    "uId" INTEGER NOT NULL,
    "pId" INTEGER NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProjectMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Invite" (
    "id" SERIAL NOT NULL,
    "sId" INTEGER NOT NULL,
    "pId" INTEGER NOT NULL,
    "oId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "respondedAt" TIMESTAMP(3),
    "status" "InviteStatus" NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "Invite_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ProjectMember_pId_idx" ON "ProjectMember"("pId");

-- CreateIndex
CREATE INDEX "ProjectMember_uId_idx" ON "ProjectMember"("uId");

-- CreateIndex
CREATE UNIQUE INDEX "ProjectMember_uId_pId_key" ON "ProjectMember"("uId", "pId");

-- CreateIndex
CREATE UNIQUE INDEX "Invite_pId_oId_key" ON "Invite"("pId", "oId");

-- AddForeignKey
ALTER TABLE "ProjectMember" ADD CONSTRAINT "ProjectMember_uId_fkey" FOREIGN KEY ("uId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectMember" ADD CONSTRAINT "ProjectMember_pId_fkey" FOREIGN KEY ("pId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invite" ADD CONSTRAINT "Invite_sId_fkey" FOREIGN KEY ("sId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invite" ADD CONSTRAINT "Invite_pId_fkey" FOREIGN KEY ("pId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invite" ADD CONSTRAINT "Invite_oId_fkey" FOREIGN KEY ("oId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
