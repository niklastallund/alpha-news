"use client";

// So i have this for previewing the image, and upload the image. This maybe solves the upload problem too, if i can take a image buffer to just preview it.
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  GeneratedArticle,
  GeneratedArticleBase,
  generateImageForArticle,
} from "@/lib/actions/ai";
import Image from "next/image";
import { ChangeEvent, useCallback, useRef, useState } from "react";
interface ImageInputProps {
  // RHFs Controller:
  onChange: (value: string | undefined) => void;
  onBlur: () => void;
  value: string | undefined; // Här kommer Base64 Data URL (temporärt) eller den slutliga R2 URL:en
  name: string;

  // Övriga props.
  showUploader?: boolean; // i preview för import vill vi inte visa det. Men i själva formuläret vill vi det. Kanske utökar till att kunna generera en bild här i? Får se. fix.
  showGenerate?: boolean;
  articleData?: GeneratedArticle | GeneratedArticleBase | undefined;
}

// Bara för att snabbt spara.
// // Return the Base64 string as a data URL for client-side use
// const dataUrl = `data:image/png;base64,${base64Image}`;

export default function ImageInput({
  onChange,
  onBlur,
  value, // So this will hold the image now :) perfect.
  name,
  showUploader = false,
  showGenerate = false,
  articleData = undefined,
}: ImageInputProps) {
  const [genMsg, setgenMsg] = useState("");

  const generateImg = useCallback(async () => {
    if (!articleData) {
      return;
    }

    setgenMsg("Generating image...");

    const asTheRightType: GeneratedArticleBase = {
      headline: articleData.headline,
      category: articleData.category,
      content: articleData.content,
      summery: articleData.summery,
    };

    const newImg = await generateImageForArticle(asTheRightType);

    if (newImg.success) {
      onChange(newImg.data);
      onBlur();
    }

    setgenMsg("");
  }, []);

  const fileImg = useCallback(async (e: ChangeEvent<HTMLInputElement>) => {
    // Check that its a valid image (png or jpg)
    const file = e.target.files?.[0];

    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("Endast bildfiler är tillåtna."); // Vi kör en säkrare validering i server-action.
        e.target.value = "";
        return;
      }
      // 1. Initialize FileReader
      const reader = new FileReader();

      reader.onload = () => {
        const dataUrl = reader.result as string;

        onChange(dataUrl);
        onBlur();
      };

      // 4. Starta läsningen av filen som en Data URL (Base64)
      reader.readAsDataURL(file);
    }

    // read the file as base64 and set it as value
  }, []);

  return (
    <div className="p-2 border-2 rounded-lg">
      {value && (
        <Image
          src={value ?? ""}
          width={512}
          height={512}
          className="w-full p-2"
          alt="Preview image"
        ></Image>
      )}
      <div className="sm:grid sm:grid-cols-2 gap-1 p-2 border-2 rounded-lg">
        {showGenerate && articleData && (
          <div className="flex justify-between sm:justify-around">
            <div>
              {!genMsg && (
                <Button
                  type="button"
                  className="bg-green-400 text-black"
                  disabled={!!genMsg}
                  onClick={() => generateImg()}
                >
                  {value ? "Regenerate" : "Generate"} image
                </Button>
              )}
              {genMsg && (
                <div className="p-2 bg-amber-200 text-black rounded-lg">
                  {genMsg}
                </div>
              )}
            </div>
            {value && (
              <Button
                type="button"
                className="bg-red-400 text-black"
                onClick={() => onChange("")}
              >
                Remove
              </Button>
            )}
          </div>
        )}

        {showUploader && (
          <div>
            <label htmlFor="uImg">Upload image</label>
            <div className="flex">
              <Input
                id="uImg"
                type="file"
                accept="image/*"
                onChange={(e) => fileImg(e)}
              ></Input>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
