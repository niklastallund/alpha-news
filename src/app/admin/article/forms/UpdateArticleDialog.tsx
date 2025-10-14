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
import { Article } from "@/generated/prisma";

export default function UpdateArticleDialog({ article }: { article: Article }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {
          <Button variant="default" size="sm">
            Update
          </Button>
        }
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl md:max-w-3xl  lg:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Update article</DialogTitle>
        </DialogHeader>
        <UpdateArticleForm article={article} />
      </DialogContent>
    </Dialog>
  );
}
