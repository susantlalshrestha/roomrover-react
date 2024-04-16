"use server";

import { API_BASE_URL } from "@roomrover/app/config";
import {
  LoginResponse,
  RegisterResponse,
  ResendVerificationCodeResponse,
  VerifyEmailResponse,
} from "@roomrover/app/models";
import { isEmpty, omit } from "lodash";
import { z, ZodError } from "zod";
import { signIn } from "../../../auth";
import { AuthError } from "next-auth";

const loginSchema = z.object({
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(50, "Password must be less than 50 characters")
    .regex(
      /[a-zA-Z0-9]/,
      "Password must contain at least one letter and one number"
    ),
});

export const authenticate = async (
  prevState: LoginResponse,
  formData: FormData
): Promise<LoginResponse> => {
  try {
    const validated = loginSchema.safeParse({
      email: formData.get("email"),
      password: formData.get("password"),
    });
    if (!validated.success) {
      if (!isEmpty(validated.error.errors)) {
        return { success: false, message: validated.error.errors[0].message };
      }
      return { success: false, message: "Form validation error occured!!" };
    }
    await signIn("credentials", {
      ...validated.data,
      redirect: false,
    });
    return { success: true };
  } catch (error) {
    if (error instanceof ZodError) {
      if (!isEmpty(error.errors)) {
        return { success: false, message: error.errors[0].message };
      }
      return { success: false, message: "Form validation error occured!!" };
    } else if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { success: false, message: "Invalid credentials." };
        default:
          return { success: false, message: error.message };
      }
    }
    console.error(error);
    return { success: false, message: "Oops!! Something went wrong!" };
  }
};

const registerSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z
      .string()
      .email("Invalid email address")
      .min(1, "Email is required"),
    phoneNumber: z
      .string()
      .min(10, "Phone number is required")
      .regex(
        /^\d{3}[-\s]?\d{3}[-\s]?\d{4}$/,
        "Invalid phone number format. Please use the format xxx-xxx-xxxx."
      ),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .max(50, "Password must be less than 50 characters")
      .regex(
        /[a-zA-Z0-9]/,
        "Password must contain at least one letter and one number"
      ),
    confirmPassword: z.string(),
    role: z.enum(["GUEST", "HOST"]),
  })
  .refine(
    (data) => (
      typeof data === "object" && data.password === data.confirmPassword,
      {
        message: "Passwords do not match",
        path: ["confirm_password"],
      }
    )
  );

export const register = async (
  prevState: RegisterResponse,
  formData: FormData
): Promise<RegisterResponse> => {
  try {
    const validated = registerSchema.safeParse({
      firstName: formData.get("first_name"),
      lastName: formData.get("last_name"),
      email: formData.get("email"),
      phoneNumber: formData.get("phone_number"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirm_password"),
      role: formData.get("role"),
    });

    if (!validated.success) {
      if (!isEmpty(validated.error.errors)) {
        return { success: false, message: validated.error.errors[0].message };
      }
      return { success: false, message: "Form validation error occured!!" };
    }

    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(omit(validated.data, "confirmPassword")),
    });
    const json: RegisterResponse = await response.json();
    console.log(json);
    if (json) return { ...json, success: response.ok };
  } catch (error) {
    if (error instanceof ZodError) {
      if (!isEmpty(error.errors)) {
        return { success: false, message: error.errors[0].message };
      }
      return { success: false, message: "Form validation error occured!!" };
    }
    console.error(JSON.stringify(error));
    return { success: false, message: "Oops!! Something went wrong!" };
  }
  return {
    success: false,
    message: "Couldn't perform the authenticate action",
  };
};

const verifyEmailSchema = z.object({
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  otp: z.string().length(6, "Invalid otp entered"),
});

export const verifyEmail = async (
  prevState: VerifyEmailResponse,
  formData: FormData
): Promise<VerifyEmailResponse> => {
  try {
    const validated = verifyEmailSchema.safeParse({
      email: formData.get("email"),
      otp: formData.get("otp"),
    });
    if (!validated.success) {
      if (!isEmpty(validated.error.errors)) {
        return { success: false, message: validated.error.errors[0].message };
      }

      return { success: false, message: "Form validation error occured!!" };
    }
    const response = await fetch(`${API_BASE_URL}/auth/verify-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(validated.data),
    });
    const json: VerifyEmailResponse = await response.json();
    if (json) return { ...json, success: response.ok };
  } catch (error) {
    if (error instanceof ZodError) {
      if (!isEmpty(error.errors)) {
        return { success: false, message: error.errors[0].message };
      }
      return { success: false, message: "Form validation error occured!!" };
    }
    console.error(error);
    return { success: false, message: "Oops!! Something went wrong!" };
  }
  return {
    success: false,
    message: "Couldn't perform the authenticate action",
  };
};

export const resendVerificationCode = async (email: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/resend-email-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });
    const json: ResendVerificationCodeResponse = await response.json();
    if (json) return { ...json, success: response.ok };
  } catch (error) {
    console.error(error);
  }
  return { success: false, message: "Oops!! Something went wrong!" };
};
