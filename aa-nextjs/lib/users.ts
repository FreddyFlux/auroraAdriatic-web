import { firestore } from "@/firebase/server";

export interface User {
  uid: string;
  email: string;
  displayName: string;
  createdAt: Date;
  updatedAt: Date;
  admin: boolean;
}

export const getUserById = async (uid: string): Promise<User | null> => {
  try {
    const doc = await firestore.collection("users").doc(uid).get();

    if (!doc.exists) {
      return null;
    }

    const data = doc.data()!;
    return {
      uid: doc.id,
      ...data,
      createdAt: data.createdAt.toDate(),
      updatedAt: data.updatedAt.toDate(),
    } as User;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
};

export const updateUser = async (
  uid: string,
  data: Partial<User>
): Promise<boolean> => {
  try {
    await firestore
      .collection("users")
      .doc(uid)
      .update({
        ...data,
        updatedAt: new Date(),
      });
    return true;
  } catch (error) {
    console.error("Error updating user:", error);
    return false;
  }
};

export const setUserAdmin = async (
  uid: string,
  isAdmin: boolean
): Promise<boolean> => {
  try {
    await firestore.collection("users").doc(uid).update({
      admin: isAdmin,
      updatedAt: new Date(),
    });
    return true;
  } catch (error) {
    console.error("Error setting user admin status:", error);
    return false;
  }
};
