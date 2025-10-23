"use client";

import type { ForwardedRef } from "react";
import "@mdxeditor/editor/style.css";
import { useTheme } from "next-themes";

import {
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  markdownShortcutPlugin,
  MDXEditor,
  type MDXEditorMethods,
  type MDXEditorProps,
  toolbarPlugin,
  UndoRedo,
  BoldItalicUnderlineToggles,
  ListsToggle,
  linkPlugin,
  linkDialogPlugin,
  tablePlugin,
} from "@mdxeditor/editor";
import { Separator } from "@radix-ui/react-dropdown-menu";

// Only import this to the next file
export default function InitializedMDXEditor({
  editorRef,
  ...props
}: { editorRef: ForwardedRef<MDXEditorMethods> | null } & MDXEditorProps) {
  const { theme } = useTheme();

  return (
    <div className="border rounded-md">
      <MDXEditor
        contentEditableClassName={`prose dark:prose-invert`}
        className={`${theme}-theme ${theme}-editor`}
        plugins={[
          toolbarPlugin({
            toolbarClassName: "my-classname",
            toolbarContents: () => (
              <>
                <UndoRedo />
                <Separator />
                <BoldItalicUnderlineToggles />
                <Separator />
                <ListsToggle options={["bullet", "number"]} />
                <Separator />
              </>
            ),
          }),
          headingsPlugin(),
          listsPlugin(),
          quotePlugin(),
          linkPlugin(),
          linkDialogPlugin(),
          thematicBreakPlugin(),
          markdownShortcutPlugin(),
          tablePlugin(),
        ]}
        {...props}
        ref={editorRef}
      />
    </div>
  );
}
