import MainPageTabs from "@/components/main-page-tabs";
import SmallHero from "@/components/small-hero";

interface HomeProps {
  params: {
    lang: string;
  };
}

export default async function Home({ params }: HomeProps) {
  const { lang } = await params;

  return (
    <>
      <div className="max-w-7xl mx-auto">
        <SmallHero />
      </div>
      <div className="max-w-7xl mx-auto">
        <MainPageTabs />
      </div>
    </>
  );
}
