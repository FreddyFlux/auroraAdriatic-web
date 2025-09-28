import { notFound } from "next/navigation";
import { ReactNode } from "react";
import LanguageProvider from "@/components/language-provider";

// Supported languages
const supportedLocales = ["en", "no", "hr"];

interface LangLayoutProps {
  children: ReactNode;
  params: Promise<{
    lang: string;
  }>;
}

export async function generateStaticParams() {
  return supportedLocales.map((lang) => ({
    lang,
  }));
}

export default async function LangLayout({
  children,
  params,
}: LangLayoutProps) {
  const { lang } = await params;

  // Validate that the incoming `lang` parameter is valid
  if (!supportedLocales.includes(lang)) {
    notFound();
  }

  return (
    <LanguageProvider lang={lang}>
      <div className="min-h-screen" data-lang={lang}>
        {children}
      </div>
    </LanguageProvider>
  );
}

// Generate metadata for each locale
export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  const titles = {
    en: "Aurora Adriatic",
    no: "Aurora Adriatic",
    hr: "Aurora Adriatic",
  };

  const descriptions = {
    en: "Aurora Adriatic - Premium yacht charter and luxury experiences",
    no: "Aurora Adriatic - Premium yacht charter og luksusopplevelser",
    hr: "Aurora Adriatic - Premium yacht charter i luksuzna iskustva",
  };

  return {
    title: titles[lang as keyof typeof titles] || titles.en,
    description:
      descriptions[lang as keyof typeof descriptions] || descriptions.en,
  };
}
