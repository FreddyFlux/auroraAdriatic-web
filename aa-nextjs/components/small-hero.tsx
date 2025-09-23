import { LettersPullUp } from "@/components/ui/text-animation/letters-up";

export default function SmallHero() {
  return (
    <div className="h-[20vh] mt-6 flex flex-col gap-4">
      <h1 className="text-4xl font-bold text-center">
        <LettersPullUp
          text="A boutique consulting company."
          className="-tracking-normal"
        />
      </h1>
      <div className="mx-auto">
        <h4 className="text-2xl"></h4>
        <h4 className="text-2xl">
          Helping you find your dream life and experiences in Croatia.
        </h4>
      </div>
    </div>
  );
}
