"use server";

import { auth } from "@/firebase/server";
import { deleteEvent } from "@/lib/events";

export const deleteEventAction = async (eventId: string, authToken: string) => {
  const verifiedToken = await auth.verifyIdToken(authToken);
  if (!verifiedToken.admin) {
    return {
      error: true,
      message: "You are not authorized to access this resource.",
    };
  }

  return await deleteEvent(eventId, authToken);
};
