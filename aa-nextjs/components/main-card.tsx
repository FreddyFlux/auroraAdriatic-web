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
import Link from "next/link";

interface MainCardProps {
  title: string;
  titleDescription: string;
  contentText: string;
  buttonText: string;
  image?: StaticImageData | SanityImage;
  imageUrl?: string; // For Sanity images
  href?: string; // Optional link for the card
}

export default function MainCard({
  title,
  titleDescription,
  contentText,
  buttonText,
  image,
  imageUrl,
  href,
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

  const CardWrapper = ({ children }: { children: React.ReactNode }) => {
    if (href) {
      return (
        <Link href={href} className="block h-full">
          {children}
        </Link>
      );
    }
    return <div className="h-full">{children}</div>;
  };

  return (
    <CardWrapper>
      <Card
        className={`w-full h-full relative overflow-hidden flex flex-col ${href ? "hover:shadow-lg transition-shadow cursor-pointer" : ""}`}
      >
        <CardHeader className="flex-shrink-0">
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
        <CardContent className=" my-auto">
          <p>{contentText}</p>
        </CardContent>
        <CardFooter className="flex-shrink-0">
          {href ? (
            <Button className="ml-auto" asChild>
              <span>{buttonText}</span>
            </Button>
          ) : (
            <Button className="ml-auto">{buttonText}</Button>
          )}
        </CardFooter>
      </Card>
    </CardWrapper>
  );
}
