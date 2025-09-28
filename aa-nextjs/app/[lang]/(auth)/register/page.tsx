import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import RegisterForm from "./register-form";

export default async function RegisterPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("firebaseAuthToken")?.value;

  if (token) {
    redirect("/");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-foreground">
            Create your account
          </h2>
        </div>
        <RegisterForm />
      </div>
    </div>
  );
}
