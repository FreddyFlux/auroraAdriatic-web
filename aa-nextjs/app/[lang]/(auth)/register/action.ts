"use server";

import { auth, firestore } from "@/firebase/server";
import { registerUserSchema } from "@/validation/registerUser";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth as clientAuth } from "@/firebase/client";

export const registerUser = async (data: {
  email: string;
  name: string;
  password: string;
  passwordConfirm: string;
}) => {
  const validation = registerUserSchema.safeParse(data);
  if (!validation.success) {
    return {
      error: true,
      message: validation.error.issues[0]?.message ?? "Validation failed",
    };
  }

  try {
    // Create user with Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(
      clientAuth,
      data.email,
      data.password
    );

    const user = userCredential.user;

    // Create user document in Firestore
    await firestore.collection("users").doc(user.uid).set({
      uid: user.uid,
      email: data.email,
      displayName: data.name,
      createdAt: new Date(),
      updatedAt: new Date(),
      admin: false, // Default to non-admin
    });

    return {
      error: false,
      message: "User registered successfully",
    };
  } catch (error: unknown) {
    console.error("Error registering user:", error);

    let errorMessage = "Failed to register user. Please try again.";

    if (error && typeof error === "object" && "code" in error) {
      const firebaseError = error as { code: string };
      if (firebaseError.code === "auth/email-already-in-use") {
        errorMessage = "Email is already in use.";
      } else if (firebaseError.code === "auth/weak-password") {
        errorMessage = "Password is too weak.";
      } else if (firebaseError.code === "auth/invalid-email") {
        errorMessage = "Invalid email address.";
      }
    }

    return {
      error: true,
      message: errorMessage,
    };
  }
};
