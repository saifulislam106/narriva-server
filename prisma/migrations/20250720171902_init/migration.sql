/*
  Warnings:

  - Added the required column `name` to the `Subscription` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `Subscription` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Subscription" ADD COLUMN     "feature" TEXT[],
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "price" TEXT NOT NULL;
