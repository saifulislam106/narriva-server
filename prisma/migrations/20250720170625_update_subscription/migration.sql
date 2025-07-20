/*
  Warnings:

  - You are about to drop the column `cancelAtPeriodEnd` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `stripeCheckoutSessionId` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `stripeCustomerId` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `stripeSubscriptionId` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `subscriptionPlanId` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the `SubscriptionPlan` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `subscriptionPlan` to the `Subscription` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updateAt` to the `Subscription` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PlanType" AS ENUM ('DIGITAL', 'PREMIUM', 'DELUX');

-- DropForeignKey
ALTER TABLE "Subscription" DROP CONSTRAINT "Subscription_subscriptionPlanId_fkey";

-- AlterTable
ALTER TABLE "Subscription" DROP COLUMN "cancelAtPeriodEnd",
DROP COLUMN "status",
DROP COLUMN "stripeCheckoutSessionId",
DROP COLUMN "stripeCustomerId",
DROP COLUMN "stripeSubscriptionId",
DROP COLUMN "subscriptionPlanId",
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "subscriptionPlan" "PlanType" NOT NULL,
ADD COLUMN     "updateAt" TIMESTAMP(3) NOT NULL;

-- DropTable
DROP TABLE "SubscriptionPlan";

-- DropEnum
DROP TYPE "SubscriptionStatus";
