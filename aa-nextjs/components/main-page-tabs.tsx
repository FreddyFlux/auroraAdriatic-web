import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MainCard from "./main-card";
import SparusImg from "@/public/intro-colnago-45-des.jpg";
import YachtingImg from "@/public/Yacht-charter-M-Y-DOMINIQUE_8.jpg";
import OliveOilImg from "@/public/olive-oil-nutrition-facts-benefits-for-skin-and-health-side-effects-more-722x406.webp";

export default function MainPageTabs() {
  return (
    <Tabs defaultValue="experiences" className="">
      <TabsList>
        <TabsTrigger value="experiences">Experiences</TabsTrigger>
        <TabsTrigger value="stays">Where to stay</TabsTrigger>
      </TabsList>
      <TabsContent value="experiences" className="mt-4">
        <div className="grid grid-cols-3 gap-4">
          <MainCard
            title="Exclusive Boat Tours"
            titleDescription="Private boat tours for groups of up to 12 people."
            contentText="Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos."
            buttonText="View"
            image={SparusImg}
          />
          <MainCard
            title="Yachting Excursions"
            titleDescription="Explore the beauty of the sea with a private yacht."
            contentText="Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos."
            buttonText="View"
            image={YachtingImg}
          />
          <MainCard
            title="Olive Oil Tasting"
            titleDescription="Taste the best olive oil in the area."
            contentText="Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos."
            buttonText="View"
            image={OliveOilImg}
          />
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
