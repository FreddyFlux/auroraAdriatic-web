import { Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import NewPropertyForm from "./new-property-form";

export default function NewPropertyPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Create New Property
        </h1>
        <p className="text-muted-foreground">
          Add a new property to your accommodation portfolio
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
            <NewPropertyForm />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
