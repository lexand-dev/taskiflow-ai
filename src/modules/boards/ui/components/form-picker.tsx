"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Control } from "react-hook-form";
import { Check, Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { unsplash } from "@/lib/unsplash";
import { defaultImages } from "@/constants/images";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";

interface FormPickerProps {
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>;
  label?: string;
  disabled?: boolean;
}

export const FormPicker = ({
  name,
  control,
  label,
  disabled
}: FormPickerProps) => {
  const [images, setImages] = useState(defaultImages);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const result = await unsplash.photos.getRandom({
          collectionIds: ["317099"],
          count: 9
        });

        if (result && result.response) {
          const newImages = result.response as typeof defaultImages;
          setImages(newImages);
        } else {
          console.error("Failed to get images from Unsplash");
        }
      } catch (error) {
        console.error("Error fetching images:", error);

        if (error instanceof Response) {
          const text = await error.text();
          console.log("Unsplash API error body:", text);
        }
        setImages(defaultImages);
      } finally {
        setIsLoading(false);
      }
    };

    fetchImages();
  }, []);

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <Loader2 className="h-6 w-6 text-violet-700 animate-spin" />
      </div>
    );
  }

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <div className="grid grid-cols-3 gap-2 mb-2">
              {images.map((image) => {
                const value = `${image.id}|${image.urls.thumb}|${image.urls.full}|${image.links.html}|${image.user.name}`;
                const selected = field.value?.startsWith(`${image.id}|`);

                return (
                  <div
                    key={image.id}
                    className={cn(
                      "cursor-pointer relative aspect-video group hover:opacity-75 transition bg-muted",
                      disabled &&
                        "opacity-50 hover:opacity-50 cursor-not-allowed"
                    )}
                    onClick={() => !disabled && field.onChange(value)}
                  >
                    <Image
                      src={image.urls.thumb}
                      alt="Unsplash image"
                      className="object-cover rounded-sm"
                      fill
                    />
                    {selected && (
                      <div className="absolute inset-y-0 h-full w-full bg-black/30 flex items-center justify-center">
                        <Check className="h-4 w-4 text-white" />
                      </div>
                    )}
                    <Link
                      href={image.links.html}
                      target="_blank"
                      className="opacity-0 group-hover:opacity-100 absolute bottom-0 w-full text-[10px] truncate text-white hover:underline p-1 bg-black/50"
                    >
                      {image.user.name}
                    </Link>
                  </div>
                );
              })}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
