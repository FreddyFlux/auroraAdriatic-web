import { z } from "zod";

export const passwordValidation = z.string().refine(
  (val) => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    return regex.test(val);
  },
  {
    message:
      "Password must contain at least 6 characters, one uppercase letter, one lowercase letter, one number and one special character",
  }
);

export const registerUserSchema = z
  .object({
    email: z.string().email("Invalid email address"),
    name: z.string().min(2, "Name must be at least 2 characters"),
    password: passwordValidation,
    passwordConfirm: z.string(),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.passwordConfirm) {
      ctx.addIssue({
        code: "custom",
        message: "Passwords do not match",
        path: ["passwordConfirm"],
      });
    }
  });
