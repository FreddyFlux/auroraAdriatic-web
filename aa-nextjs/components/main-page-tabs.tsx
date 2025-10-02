import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MainCard from "./main-card";
import { getFeaturedEvents, getSanityImageUrl } from "@/lib/sanity";
import { getEventById } from "@/lib/events";

interface MainPageTabsProps {
  locale: string;
}

export default async function MainPageTabs({ locale }: MainPageTabsProps) {
  // Fetch featured events from Sanity
  const featuredEvents = await getFeaturedEvents(locale);

  // Fetch Firebase event data for each featured event to get slugs
  const eventsWithSlugs = await Promise.all(
    featuredEvents.map(async (sanityEvent) => {
      const firebaseEvent = await getEventById(sanityEvent.eventId);
      return {
        sanity: sanityEvent,
        firebase: firebaseEvent,
      };
    })
  );

  return (
    <Tabs defaultValue="experiences" className="">
      <TabsList>
        <TabsTrigger value="experiences">Experiences</TabsTrigger>
        <TabsTrigger value="stays">Where to stay</TabsTrigger>
      </TabsList>
      <TabsContent value="experiences" className="mt-4">
        <div className="grid grid-cols-3 gap-4">
          {eventsWithSlugs.map(({ sanity, firebase }) => (
            <MainCard
              key={sanity._id}
              title={sanity.titleTranslation}
              titleDescription={sanity.catchphrase}
              contentText={sanity.shortDescription}
              buttonText="View"
              image={sanity.images?.[0]}
              imageUrl={
                sanity.images?.[0]
                  ? getSanityImageUrl(sanity.images[0])
                  : undefined
              }
              href={
                firebase?.slug
                  ? `/${locale}/events/${firebase.slug}`
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
