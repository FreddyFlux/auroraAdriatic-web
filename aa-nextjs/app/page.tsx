import MainPageTabs from "@/components/main-page-tabs";
import SmallHero from "@/components/small-hero";
export default function Home() {
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
