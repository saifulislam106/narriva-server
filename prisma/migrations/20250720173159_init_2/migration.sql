/*
  Warnings:

  - You are about to drop the column `subscriptionPlan` on the `Subscription` table. All the data in the column will be lost.
  - Added the required column `plan` to the `Subscription` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Subscription" DROP COLUMN "subscriptionPlan",
ADD COLUMN     "plan" "PlanType" NOT NULL;
