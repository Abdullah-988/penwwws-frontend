import { z } from "zod";

export const emailValidation = z
  .string()
  .email("Invalid email address")
  .nonempty("Email is required");

export const passwordValidation = z
  .string()
  .min(8, "Password must be at least 8 characters long")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one digit")
  .regex(
    /[@$!%*?&]/,
    "Password must contain at least one special character (@$!%*?&)",
  );

export const signupFormSchema = z
  .object({
    fullName: z
      .string()
      .nonempty("Full name is required")
      .min(2, "Full name may not be less than 2 characters")
      .max(30, "Full name can't be more than 30 characters"),
    email: emailValidation,
    password: passwordValidation,
    confirmPassword: z.string().nonempty("Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Confirm password does not match",
  });

export const signinFormSchema = z.object({
  email: emailValidation,
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

export const groupSchema = z.object({
  name: z.string().trim().nonempty("Group name is required"),
  parentId: z.number().nullable().optional(),
});

export type GroupFormData = z.infer<typeof groupSchema>;
<<<<<<< HEAD

export const editSchoolSchema = z.object({
  name: z.string().nonempty("School name can not be empty"),
  description: z.string().optional(),
  logoUrl: z.string().optional(),
});
=======
>>>>>>> main
