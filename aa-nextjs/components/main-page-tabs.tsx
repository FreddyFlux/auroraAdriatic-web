import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MainCard from "./main-card";
import {
  getFeaturedEvents,
  getSanityImageUrl,
  SanityEvent,
} from "@/lib/sanity";

interface MainPageTabsProps {
  locale: string;
}

export default async function MainPageTabs({ locale }: MainPageTabsProps) {
  // Fetch featured events from Sanity
  const featuredEvents = await getFeaturedEvents(locale);
  return (
    <Tabs defaultValue="experiences" className="">
      <TabsList>
        <TabsTrigger value="experiences">Experiences</TabsTrigger>
        <TabsTrigger value="stays">Where to stay</TabsTrigger>
      </TabsList>
      <TabsContent value="experiences" className="mt-4">
        <div className="grid grid-cols-3 gap-4">
          {featuredEvents.map((event: SanityEvent) => (
            <MainCard
              key={event._id}
              title={event.titleTranslation}
              titleDescription={event.catchphrase}
              contentText={event.shortDescription}
              buttonText="View"
              image={event.images?.[0]}
              imageUrl={
                event.images?.[0]
                  ? getSanityImageUrl(event.images[0])
                  : undefined
              }
            />
          ))}
        </div>
      </TabsContent>
      <TabsContent value="stays" className="mt-4">
        <div className="grid grid-cols-3 gap-4">
          <MainCard
            title="Luxury Accommodations"
            titleDescription="Luxurious accommodations for groups of up to 12 people."
            contentText="Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos."
            buttonText="View"
          />
          <MainCard
            title="Luxury Accommodations"
            titleDescription="Luxurious accommodations for groups of up to 12 people."
            contentText="Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos."
            buttonText="View"
          />
          <MainCard
            title="Luxury Accommodations"
            titleDescription="Luxurious accommodations for groups of up to 12 people."
            contentText="Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos."
            buttonText="View"
          />
        </div>
      </TabsContent>
    </Tabs>
  );
}
