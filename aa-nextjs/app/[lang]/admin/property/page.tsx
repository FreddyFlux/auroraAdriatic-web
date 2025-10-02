import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PlusCircleIcon, HomeIcon, EditIcon } from "lucide-react";
import { getAllProperties } from "@/lib/properties";
import DeletePropertyButton from "@/components/delete-property-button";

export default async function PropertiesPage() {
  const properties = await getAllProperties();
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Properties</h1>
          <p className="text-muted-foreground">
            Manage your properties and accommodations
          </p>
        </div>
        <Link href="/admin/property/new">
          <Button>
            <PlusCircleIcon className="mr-2 h-4 w-4" />
            Create Property
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((property) => (
          <Card key={property.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{property.title}</CardTitle>
                  <CardDescription className="mt-1">
                    {property.description}
                  </CardDescription>
                </div>
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    property.status === "published"
                      ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                      : property.status === "draft"
                        ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
                        : "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
                  }`}
                >
                  {property.status}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center text-sm text-muted-foreground">
                  <HomeIcon className="mr-2 h-4 w-4" />
                  {property.propertyType} • {property.bedrooms} bed •{" "}
                  {property.bathrooms} bath
                </div>
                <div className="text-sm text-muted-foreground">
                  Guests: {property.guests} • Area: {property.area}m²
                </div>
                <div className="text-sm text-muted-foreground">
                  Price: €{property.pricePerNight}/night
                </div>
                <div className="text-sm text-muted-foreground">
                  Location: {property.location}
                </div>
                <div className="flex space-x-2 pt-2">
                  <Link href={`/admin/property/edit/${property.slug}`}>
                    <Button variant="outline" size="sm">
                      <EditIcon className="mr-1 h-3 w-3" />
                      Edit
                    </Button>
                  </Link>
                  <DeletePropertyButton propertyId={property.id} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
