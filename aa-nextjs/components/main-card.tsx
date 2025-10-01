import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ImageIcon } from "lucide-react";
import { Button } from "./ui/button";
import Image, { StaticImageData } from "next/image";
import { SanityImage, getSanityImageUrl } from "@/lib/sanity";

interface MainCardProps {
  title: string;
  titleDescription: string;
  contentText: string;
  buttonText: string;
  image?: StaticImageData | SanityImage;
  imageUrl?: string; // For Sanity images
}

export default function MainCard({
  title,
  titleDescription,
  contentText,
  buttonText,
  image,
  imageUrl,
}: MainCardProps) {
  // Determine image source and alt text
  const getImageProps = () => {
    if (imageUrl) {
      return {
        src: imageUrl,
        alt: (image as SanityImage)?.alt || title,
      };
    }

    if (image && "src" in image) {
      // StaticImageData
      return {
        src: image,
        alt: title,
      };
    }

    return null;
  };

  const imageProps = getImageProps();

  return (
    <Card className="w-full relative overflow-hidden">
      <CardHeader>
        {imageProps ? (
          <Image
            src={imageProps.src}
            alt={imageProps.alt}
            className="absolute top-0 left-0 h-[20vh] w-full object-cover"
            width={400}
            height={200}
          />
        ) : (
          <div className="absolute top-0 left-0 h-[20vh] w-full flex items-center justify-center ">
            <ImageIcon className="h-16 w-16 text-gray-400" />
          </div>
        )}
        <CardTitle className="mt-[20vh] text-lg font-bold">{title}</CardTitle>
        <CardDescription>{titleDescription}</CardDescription>
      </CardHeader>
      <CardContent className="mt-auto">
        <p>{contentText}</p>
      </CardContent>
      <CardFooter>
        <Button className="ml-auto">{buttonText}</Button>
      </CardFooter>
    </Card>
  );
}
