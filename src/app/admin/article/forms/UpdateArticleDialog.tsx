"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import UpdateArticleForm from "./UpdateArticle";
import { Article, Category } from "@/generated/prisma";
import { Separator } from "@/components/ui/separator";
import { EditArticleCategories } from "./EditArticleCategories";

export default function UpdateArticleDialog({
  article,
  currentCategories,
  allCategories,
}: {
  article: Article;
  currentCategories: Category[];
  allCategories: Category[];
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {
          <Button variant="default" size="sm">
            Update
          </Button>
        }
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl md:max-w-6xl  lg:max-w-7xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Update article</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col md:flex-row justify-center gap-4">
          <div className="flex-1">
            <UpdateArticleForm article={article} />
          </div>
          <div className="flex-1">
            <EditArticleCategories
              articleId={article.id}
              currentCategoryIds={currentCategories.map((c) => c.id)}
              allCategories={allCategories}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
