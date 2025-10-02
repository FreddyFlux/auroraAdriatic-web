"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { propertyDataSchema, PropertyData } from "@/validation/propertySchema";
import { createProperty } from "@/app/[lang]/admin/property/new/action";
import { useAuth } from "@/context/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// Removed unused Card imports
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, X } from "lucide-react";
import { toast } from "sonner";

export default function NewPropertyForm() {
  const router = useRouter();
  const auth = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Simple client-side slug generation for preview (server should also validate)
  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  const form = useForm<PropertyData>({
    resolver: zodResolver(propertyDataSchema),
    defaultValues: {
      title: "",
      slug: "",
      description: "",
      location: "",
      propertyType: "apartment",
      bedrooms: 1,
      bathrooms: 1,
      guests: 2,
      pricePerNight: 0,
      area: 50,
      status: "draft",
      isPublic: true,
      checkInTime: "15:00",
      checkOutTime: "11:00",
      minimumStay: 1,
      contactEmail: "",
      contactPhone: "",
      amenities: [],
      houseRules: [],
    },
  });

  // Auto-generate slug when title changes
  const watchedTitle = form.watch("title");
  useEffect(() => {
    if (watchedTitle) {
      const generated = generateSlug(watchedTitle);
      form.setValue("slug", generated);
    }
  }, [watchedTitle, form]);

  const onSubmit = async (data: PropertyData) => {
    setIsSubmitting(true);

    try {
      const token = await auth?.currentUser?.getIdToken();
      if (!token) {
        toast.error("Error!", {
          description: "You must be logged in to create properties",
        });
        return;
      }

      const result = await createProperty(data, token);

      if (result.error) {
        toast.error("Error!", {
          description: result.message,
        });
        return;
      }

      toast.success("Success!", {
        description: "Property created successfully",
      });

      router.push(`/admin/property`);
    } catch (err) {
      toast.error("Error!", {
        description: "Failed to create property",
      });
      console.error("Error creating property:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const addAmenity = () => {
    const currentAmenities = form.getValues("amenities") || [];
    form.setValue("amenities", [...currentAmenities, ""]);
  };

  const removeAmenity = (index: number) => {
    const currentAmenities = form.getValues("amenities") || [];
    form.setValue(
      "amenities",
      currentAmenities.filter((_, i) => i !== index)
    );
  };

  const addHouseRule = () => {
    const currentRules = form.getValues("houseRules") || [];
    form.setValue("houseRules", [...currentRules, ""]);
  };

  const removeHouseRule = (index: number) => {
    const currentRules = form.getValues("houseRules") || [];
    form.setValue(
      "houseRules",
      currentRules.filter((_, i) => i !== index)
    );
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="location">Location</TabsTrigger>
          <TabsTrigger value="policies">Policies</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Property Title *</Label>
              <Input
                id="title"
                {...form.register("title")}
                className={
                  form.formState.errors.title ? "border-destructive" : ""
                }
              />
              {form.formState.errors.title && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.title.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug *</Label>
              <Input
                id="slug"
                {...form.register("slug")}
                className={
                  form.formState.errors.slug ? "border-destructive" : ""
                }
                placeholder="auto-generated-from-title"
                readOnly
                disabled
              />
              {form.formState.errors.slug && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.slug.message}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                Slug is automatically generated and cannot be edited
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              {...form.register("description")}
              className={
                form.formState.errors.description ? "border-destructive" : ""
              }
              rows={4}
            />
            {form.formState.errors.description && (
              <p className="text-sm text-destructive">
                {form.formState.errors.description.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="propertyType">Property Type *</Label>
              <Select
                value={form.watch("propertyType")}
                onValueChange={(value) =>
                  form.setValue(
                    "propertyType",
                    value as PropertyData["propertyType"]
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select property type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="apartment">Apartment</SelectItem>
                  <SelectItem value="house">House</SelectItem>
                  <SelectItem value="villa">Villa</SelectItem>
                  <SelectItem value="condo">Condo</SelectItem>
                  <SelectItem value="studio">Studio</SelectItem>
                  <SelectItem value="penthouse">Penthouse</SelectItem>
                  <SelectItem value="townhouse">Townhouse</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status *</Label>
              <Select
                value={form.watch("status")}
                onValueChange={(value) =>
                  form.setValue("status", value as PropertyData["status"])
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="details" className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bedrooms">Bedrooms *</Label>
              <Input
                id="bedrooms"
                type="number"
                {...form.register("bedrooms", { valueAsNumber: true })}
                className={
                  form.formState.errors.bedrooms ? "border-destructive" : ""
                }
              />
              {form.formState.errors.bedrooms && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.bedrooms.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="bathrooms">Bathrooms *</Label>
              <Input
                id="bathrooms"
                type="number"
                {...form.register("bathrooms", { valueAsNumber: true })}
                className={
                  form.formState.errors.bathrooms ? "border-destructive" : ""
                }
              />
              {form.formState.errors.bathrooms && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.bathrooms.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="guests">Max Guests *</Label>
              <Input
                id="guests"
                type="number"
                {...form.register("guests", { valueAsNumber: true })}
                className={
                  form.formState.errors.guests ? "border-destructive" : ""
                }
              />
              {form.formState.errors.guests && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.guests.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="area">Area (m²) *</Label>
              <Input
                id="area"
                type="number"
                {...form.register("area", { valueAsNumber: true })}
                className={
                  form.formState.errors.area ? "border-destructive" : ""
                }
              />
              {form.formState.errors.area && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.area.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pricePerNight">Price per Night (€) *</Label>
              <Input
                id="pricePerNight"
                type="number"
                step="0.01"
                {...form.register("pricePerNight", { valueAsNumber: true })}
                className={
                  form.formState.errors.pricePerNight
                    ? "border-destructive"
                    : ""
                }
              />
              {form.formState.errors.pricePerNight && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.pricePerNight.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                {...form.register("location")}
                className={
                  form.formState.errors.location ? "border-destructive" : ""
                }
              />
              {form.formState.errors.location && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.location.message}
                </p>
              )}
            </div>
          </div>

          {/* Amenities */}
          <div className="space-y-2">
            <Label>Amenities</Label>
            <div className="space-y-2">
              {form.watch("amenities")?.map((amenity, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={amenity}
                    onChange={(e) => {
                      const amenities = form.getValues("amenities") || [];
                      amenities[index] = e.target.value;
                      form.setValue("amenities", amenities);
                    }}
                    placeholder="Enter amenity"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeAmenity(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button type="button" variant="outline" onClick={addAmenity}>
                <Plus className="mr-2 h-4 w-4" />
                Add Amenity
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="location" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="location">Location *</Label>
            <Input
              id="location"
              {...form.register("location")}
              className={
                form.formState.errors.location ? "border-destructive" : ""
              }
              placeholder="Enter property location (e.g., Dubrovnik, Croatia)"
            />
            {form.formState.errors.location && (
              <p className="text-sm text-destructive">
                {form.formState.errors.location.message}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              Enter the general location of the property (city, region,
              country).
            </p>
          </div>
        </TabsContent>

        <TabsContent value="policies" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="checkInTime">Check-in Time</Label>
              <Input
                id="checkInTime"
                type="time"
                {...form.register("checkInTime")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="checkOutTime">Check-out Time</Label>
              <Input
                id="checkOutTime"
                type="time"
                {...form.register("checkOutTime")}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="minimumStay">Minimum Stay (nights)</Label>
              <Input
                id="minimumStay"
                type="number"
                {...form.register("minimumStay", { valueAsNumber: true })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maximumStay">Maximum Stay (nights)</Label>
              <Input
                id="maximumStay"
                type="number"
                {...form.register("maximumStay", { valueAsNumber: true })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contactEmail">Contact Email</Label>
              <Input
                id="contactEmail"
                type="email"
                {...form.register("contactEmail")}
                className={
                  form.formState.errors.contactEmail ? "border-destructive" : ""
                }
              />
              {form.formState.errors.contactEmail && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.contactEmail.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactPhone">Contact Phone</Label>
              <Input id="contactPhone" {...form.register("contactPhone")} />
            </div>
          </div>

          {/* House Rules */}
          <div className="space-y-2">
            <Label>House Rules</Label>
            <div className="space-y-2">
              {form.watch("houseRules")?.map((rule, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={rule}
                    onChange={(e) => {
                      const rules = form.getValues("houseRules") || [];
                      rules[index] = e.target.value;
                      form.setValue("houseRules", rules);
                    }}
                    placeholder="Enter house rule"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeHouseRule(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button type="button" variant="outline" onClick={addHouseRule}>
                <Plus className="mr-2 h-4 w-4" />
                Add House Rule
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Property"}
        </Button>
      </div>
    </form>
  );
}
