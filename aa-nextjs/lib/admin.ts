import { auth } from "@/firebase/server";

/**
 * Sets custom claims for a user based on their email
 * This function should be called when a user logs in to set admin claims
 */
export const setUserCustomClaims = async (
  uid: string,
  email: string
): Promise<void> => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL;

    if (!adminEmail) {
      console.warn("ADMIN_EMAIL environment variable not set");
      return;
    }

    // Check if the user's email matches the admin email
    const isAdmin = email === adminEmail;

    // Set custom claims
    await auth.setCustomUserClaims(uid, {
      admin: isAdmin,
    });

    console.log(`Custom claims set for user ${email}: admin=${isAdmin}`);
  } catch (error) {
    console.error("Error setting custom claims:", error);
    throw error;
  }
};

/**
 * Gets user by email and sets admin claims if they match ADMIN_EMAIL
 */
export const setAdminClaimsByEmail = async (email: string): Promise<void> => {
  try {
    const user = await auth.getUserByEmail(email);
    await setUserCustomClaims(user.uid, email);
  } catch (error) {
    console.error(`Error setting admin claims for email ${email}:`, error);
    throw error;
  }
};
