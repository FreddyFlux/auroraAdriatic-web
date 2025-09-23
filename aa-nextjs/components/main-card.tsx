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

interface MainCardProps {
  title: string;
  titleDescription: string;
  contentText: string;
  buttonText: string;
  image?: StaticImageData;
}

export default function MainCard({
  title,
  titleDescription,
  contentText,
  buttonText,
  image,
}: MainCardProps) {
  return (
    <Card className="w-full relative overflow-hidden">
      <CardHeader>
        {image ? (
          <Image
            src={image}
            alt={title}
            className="absolute top-0 left-0 h-[20vh] w-full object-cover"
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
