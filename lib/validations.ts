import { z } from "zod";

export const signupFormSchema = z
  .object({
    fullName: z
      .string()
      .nonempty("Full name is required")
      .min(2, "Full name may not be less than 2 characters")
      .max(30, "Full name can't be more than 30 characters"),
    email: z
      .string()
      .email("Invalid email address")
      .nonempty("Email is required"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one digit")
      .regex(
        /[@$!%*?&]/,
        "Password must contain at least one special character (@$!%*?&)",
      ),
    confirmPassword: z.string().nonempty("Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Confirm password does not match",
  });
