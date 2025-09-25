import { redirect } from "next/navigation";

export default function RootPage() {
  // This page will be handled by middleware, but we include it as a fallback
  redirect("/en");
}
