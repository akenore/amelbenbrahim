import Image, { type ImageProps } from "next/image";
import type { Photo } from "@/lib/images";

/** next/image for both local (blurred placeholder) and remote illustrative photos. */
export function Picture({ photo, alt, style, ...props }: { photo: Photo; alt?: string } & Omit<ImageProps, "src" | "alt">) {
  return (
    <Image
      src={photo.src}
      alt={alt ?? photo.alt}
      placeholder={typeof photo.src === "string" ? "empty" : "blur"}
      style={photo.focus ? { objectPosition: photo.focus, ...style } : style}
      {...props}
    />
  );
}
