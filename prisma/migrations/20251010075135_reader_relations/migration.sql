/*
  Warnings:

  - You are about to drop the column `categoryId` on the `Article` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Article" DROP CONSTRAINT "Article_categoryId_fkey";

-- AlterTable
ALTER TABLE "Article" DROP COLUMN "categoryId",
ADD COLUMN     "editorsChoice" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "_ArticleToUser" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ArticleToUser_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_ArticleToCategory" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_ArticleToCategory_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_ArticleToUser_B_index" ON "_ArticleToUser"("B");

-- CreateIndex
CREATE INDEX "_ArticleToCategory_B_index" ON "_ArticleToCategory"("B");

-- AddForeignKey
ALTER TABLE "_ArticleToUser" ADD CONSTRAINT "_ArticleToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Article"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ArticleToUser" ADD CONSTRAINT "_ArticleToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ArticleToCategory" ADD CONSTRAINT "_ArticleToCategory_A_fkey" FOREIGN KEY ("A") REFERENCES "Article"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ArticleToCategory" ADD CONSTRAINT "_ArticleToCategory_B_fkey" FOREIGN KEY ("B") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;
