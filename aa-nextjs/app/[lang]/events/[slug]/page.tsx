import { notFound } from "next/navigation";
import { getEventBySlug } from "@/lib/events";
import { getEventByEventId, getSanityImageUrl } from "@/lib/sanity";
import Image from "next/image";
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface EventDetailPageProps {
  params: {
    lang: string;
    slug: string;
  };
}

export default async function EventDetailPage({
  params,
}: EventDetailPageProps) {
  const { slug, lang } = await params;

  // Fetch Firebase event data by slug
  const firebaseEvent = await getEventBySlug(slug);

  if (!firebaseEvent) {
    notFound();
  }

  // Fetch Sanity content by eventId and locale
  const sanityEvent = await getEventByEventId(firebaseEvent.id, lang);

  // Format dates
  const startDate = new Date(firebaseEvent.startDate).toLocaleDateString(
    lang === "no" ? "nb-NO" : lang === "hr" ? "hr-HR" : "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  const endDate = new Date(firebaseEvent.endDate).toLocaleDateString(
    lang === "no" ? "nb-NO" : lang === "hr" ? "hr-HR" : "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  // Calculate duration in days
  const durationMs =
    new Date(firebaseEvent.endDate).getTime() -
    new Date(firebaseEvent.startDate).getTime();
  const durationDays = Math.ceil(durationMs / (1000 * 60 * 60 * 24));

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section with Image */}
      <div className="relative w-full h-[50vh] md:h-[60vh] mb-8 rounded-lg overflow-hidden">
        {sanityEvent?.images?.[0] ? (
          <Image
            src={getSanityImageUrl(sanityEvent.images[0], 1200, 600)}
            alt={sanityEvent.images[0].alt || sanityEvent.titleTranslation}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <Calendar className="h-24 w-24 text-muted-foreground" />
          </div>
        )}
      </div>

      {/* Title and Description */}
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
          {sanityEvent?.titleTranslation || firebaseEvent.title}
        </h1>
        {sanityEvent?.catchphrase && (
          <p className="text-xl text-muted-foreground mb-4">
            {sanityEvent.catchphrase}
          </p>
        )}
      </div>

      {/* Key Information Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              <CardTitle className="text-sm font-medium">Dates</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {startDate} - {endDate}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              <CardTitle className="text-sm font-medium">Duration</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {durationDays} {durationDays === 1 ? "day" : "days"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              <CardTitle className="text-sm font-medium">Location</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {firebaseEvent.location}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <CardTitle className="text-sm font-medium">Capacity</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Up to {firebaseEvent.maxParticipants} participants
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Price */}
      <Card className="mb-8 border-primary">
        <CardHeader>
          <CardTitle>Pricing</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-primary">
              €{firebaseEvent.price}
            </span>
            <span className="text-muted-foreground">per person</span>
          </div>
        </CardContent>
      </Card>

      {/* Description */}
      {sanityEvent?.description && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>About This Event</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none">
              {sanityEvent.shortDescription}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Highlights */}
      {sanityEvent?.highlights && sanityEvent.highlights.length > 0 && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Highlights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sanityEvent.highlights.map((highlight, index) => (
                <div key={index} className="flex gap-3">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-lg">{highlight.icon}</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{highlight.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {highlight.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Itinerary */}
      {sanityEvent?.itinerary && sanityEvent.itinerary.length > 0 && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Itinerary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {sanityEvent.itinerary.map((day, index) => (
                <div
                  key={index}
                  className="border-l-2 border-primary pl-6 pb-6 last:pb-0"
                >
                  <div className="relative">
                    <div className="absolute -left-[30px] top-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
                      {day.day}
                    </div>
                    <h3 className="font-semibold text-lg mb-3">{day.title}</h3>
                    <div className="space-y-3">
                      {day.activities.map((activity, actIndex) => (
                        <div key={actIndex} className="bg-muted p-3 rounded-md">
                          <div className="flex items-center gap-2 mb-1">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium">
                              {activity.time}
                            </span>
                          </div>
                          <h4 className="font-medium mb-1">
                            {activity.activity}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {activity.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* What's Included / Not Included */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {sanityEvent?.included && sanityEvent.included.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-green-600 dark:text-green-400">
                What's Included
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {sanityEvent.included.map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {sanityEvent?.notIncluded && sanityEvent.notIncluded.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-red-600 dark:text-red-400">
                What's Not Included
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {sanityEvent.notIncluded.map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <XCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Requirements */}
      {sanityEvent?.requirements && sanityEvent.requirements.length > 0 && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Requirements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {sanityEvent.requirements.map((requirement, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-md ${
                    requirement.mandatory
                      ? "bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800"
                      : "bg-muted"
                  }`}
                >
                  <h4 className="font-medium mb-1 flex items-center gap-2">
                    {requirement.title}
                    {requirement.mandatory && (
                      <span className="text-xs bg-yellow-200 dark:bg-yellow-800 px-2 py-0.5 rounded">
                        Required
                      </span>
                    )}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {requirement.description}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Testimonials */}
      {sanityEvent?.testimonials && sanityEvent.testimonials.length > 0 && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>What Our Guests Say</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sanityEvent.testimonials.map((testimonial, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">
                        {testimonial.name}
                      </CardTitle>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span
                            key={i}
                            className={
                              i < testimonial.rating
                                ? "text-yellow-400"
                                : "text-gray-300"
                            }
                          >
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                    <CardDescription>{testimonial.date}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      "{testimonial.text}"
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Image Gallery */}
      {sanityEvent?.images && sanityEvent.images.length > 1 && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Gallery</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {sanityEvent.images.slice(1).map((image, index) => (
                <div
                  key={index}
                  className="relative aspect-square rounded-lg overflow-hidden"
                >
                  <Image
                    src={getSanityImageUrl(image, 300, 300)}
                    alt={image.alt || `Event image ${index + 2}`}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* CTA Section */}
      <Card className="bg-primary text-primary-foreground">
        <CardContent className="flex flex-col md:flex-row items-center justify-between gap-4 py-6">
          <div>
            <h3 className="text-2xl font-bold mb-2">Ready to Book?</h3>
            <p className="opacity-90">
              Secure your spot for this amazing experience
            </p>
          </div>
          <Button size="lg" variant="secondary" className="min-w-[200px]">
            Book Now - €{firebaseEvent.price}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
