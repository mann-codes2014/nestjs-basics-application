/*
  Warnings:

  - Added the required column `userId` to the `bookmarks` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "bookmarks" ADD COLUMN     "userId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "bookmarks" ADD CONSTRAINT "bookmarks_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
