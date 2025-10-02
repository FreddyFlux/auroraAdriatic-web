import { notFound } from "next/navigation";
import { getPropertyBySlug } from "@/lib/properties";
import { Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import EditPropertyForm from "./edit-property-form";

interface EditPropertyPageProps {
  params: { lang: string; slug: string };
}

export default async function EditPropertyPage({
  params,
}: EditPropertyPageProps) {
  const { slug } = await params;

  // Fetch property from Firebase
  const property = await getPropertyBySlug(slug);

  if (!property) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Edit Property</h1>
        <p className="text-muted-foreground">
          Update property details and settings
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Property Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Suspense
            fallback={
              <div className="h-64 flex items-center justify-center">
                <div className="animate-pulse">Loading form...</div>
              </div>
            }
          >
            <EditPropertyForm property={property} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
