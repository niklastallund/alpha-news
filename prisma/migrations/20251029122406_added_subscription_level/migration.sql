-- CreateEnum
CREATE TYPE "SubscriptionLevel" AS ENUM ('basic', 'pro');

-- AlterTable
ALTER TABLE "Article" ADD COLUMN     "onlyFor" "SubscriptionLevel";
