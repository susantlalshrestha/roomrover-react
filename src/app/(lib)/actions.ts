"use server";

import { API_BASE_URL } from "@roomrover/app/config";
import {
  Account,
  AuthToken,
  CreateRoomAdResponse,
  GetRoomResponse,
  GetRoomsResponse,
  LoginResponse,
  RegisterResponse,
  ResendVerificationCodeResponse,
  UpdateRoomAdResponse,
  VerifyEmailResponse,
} from "@roomrover/app/models";
import { isEmpty, omit } from "lodash";
import { z, ZodError } from "zod";
import { auth, AuthUser, signIn, signOut } from "../../../auth";
import { AuthError } from "next-auth";
import AppAuthError from "../../../auth-error";
import { permanentRedirect } from "next/navigation";

export const sessionAccount = async () => {
  const authdata = await auth();
  let account: Account | undefined = undefined;
  if (authdata && authdata.user) {
    let user = authdata.user as AuthUser;
    if (!user.auth.data) logout();
    account = user.auth.data?.account;
  }
  return account;
};

export const sessionToken = async () => {
  const authdata = await auth();
  let token: AuthToken | undefined = undefined;
  if (authdata && authdata.user) {
    let user = authdata.user as AuthUser;
    if (!user.auth.data) logout();
    token = user.auth.data?.token;
  }
  return token;
};

export const logout = async () => {
  signOut();
  permanentRedirect("/");
};

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
    } else if (error instanceof AppAuthError) {
      return { success: false, message: error.message, action: error.action };
    } else if (error instanceof AuthError) {
      return { success: false, message: "Invalid credentials." };
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

const createRoomAdSchema = z.object({
  title: z.string().min(1, "RoomAd title is required"),
  description: z.string().min(10, "Write atleast 10 characters"),
  price: z
    .string()
    .refine((value) => !isNaN(parseFloat(value)), {
      message: "Input must be a valid number",
    })
    .refine((value) => parseFloat(value) > 0, {
      message: "Input must be greater than zero",
    }),
});

export const createRoomAd = async (
  prevState: CreateRoomAdResponse,
  formData: FormData
) => {
  try {
    const validated = createRoomAdSchema.safeParse({
      title: formData.get("title"),
      description: formData.get("description"),
      price: formData.get("price"),
    });
    if (!validated.success) {
      if (!isEmpty(validated.error.errors)) {
        return { success: false, message: validated.error.errors[0].message };
      }
      return { success: false, message: "Form validation error occured!!" };
    }
    const token = await sessionToken();
    if (!token) logout();
    const response = await fetch(`${API_BASE_URL}/rooms/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token?.access}`,
      },
      body: JSON.stringify(validated.data),
    });
    const json: CreateRoomAdResponse = await response.json();

    if (
      !response.ok &&
      json.action &&
      json.action === ("refresh-token" || "logout")
    ) {
      console.log(json);
      logout();
    }
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
    message: "Couldn't perform the create roomad action",
  };
};

export const getRooms = async () => {
  const token = await sessionToken();
  try {
    const response = await fetch(`${API_BASE_URL}/account/get-rooms`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token?.access}`,
      },
    });
    const json: GetRoomsResponse = await response.json();
    if (json) return { ...json, success: response.ok };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Oops!! Something went wrong!" };
  }
};

export const getAllRooms = async (
  search?: string,
  minPrice?: number,
  maxPrice?: number
) => {
  try {
    const response = await fetch(`${API_BASE_URL}/rooms/get-all`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ search, minPrice, maxPrice }),
    });
    const json: GetRoomsResponse = await response.json();
    if (json) return { ...json, success: response.ok };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Oops!! Something went wrong!" };
  }
};

const getFilteredRoomSchema = z.object({
  minPrice: z
    .string()
    .refine((value) => !isNaN(parseFloat(value)), {
      message: "Input must be a valid number",
    })
    .refine((value) => parseFloat(value) > 0, {
      message: "Input must be greater than zero",
    }),
  maxPrice: z
    .string()
    .refine((value) => !isNaN(parseFloat(value)), {
      message: "Input must be a valid number",
    })
    .refine((value) => parseFloat(value) > 0, {
      message: "Input must be greater than zero",
    }),
});

export const getFilteredRooms = async (
  prevState: GetRoomsResponse,
  formData: FormData
) => {
  const validated = getFilteredRoomSchema.safeParse({
    minPrice: formData?.get("minPrice"),
    maxPrice: formData?.get("maxPrice"),
  });

  try {
    const response = await fetch(`${API_BASE_URL}/rooms/get-all`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    const json: GetRoomsResponse = await response.json();
    if (json) return { ...json, success: response.ok };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Oops!! Something went wrong!" };
  }
  return {
    success: false,
    message: "Couldn't perform the filter room ad action",
  };
};

export const getRoom = async (id: string) => {
  const token = await sessionToken();
  try {
    const response = await fetch(`${API_BASE_URL}/rooms/get/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const json: GetRoomResponse = await response.json();
    if (json) return { ...json, success: response.ok };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Oops!! Something went wrong!" };
  }
};

export const publishRoom = async (id: string) => {
  const token = await sessionToken();
  try {
    const response = await fetch(`${API_BASE_URL}/rooms/update/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token?.access}`,
      },
      body: JSON.stringify({ published: true }),
    });
    const json: GetRoomsResponse = await response.json();
    if (json) return { ...json, success: response.ok };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Oops!! Something went wrong!" };
  }
};

export const uploadRoomImage = async (id: string, images: string[]) => {
  const token = await sessionToken();
  try {
    const response = await fetch(`${API_BASE_URL}/rooms/update/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token?.access}`,
      },
      body: JSON.stringify({ images }),
    });
    const json: GetRoomsResponse = await response.json();
    if (json) return { ...json, success: response.ok };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Oops!! Something went wrong!" };
  }
};

const updateRoomAdSchema = z.object({
  id: z.string().min(1, "RoomAd ID is required"),
  title: z.string().min(1, "RoomAd title is required"),
  description: z.string().min(10, "Write atleast 10 characters"),
  price: z
    .string()
    .refine((value) => !isNaN(parseFloat(value)), {
      message: "Input must be a valid number",
    })
    .refine((value) => parseFloat(value) > 0, {
      message: "Input must be greater than zero",
    }),
});

export const updateRoomAd = async (
  prevState: UpdateRoomAdResponse,
  formData: FormData
) => {
  const validated = updateRoomAdSchema.safeParse({
    id: formData.get("id"),
    title: formData.get("title"),
    description: formData.get("description"),
    price: formData.get("price"),
  });
  if (!validated.success) {
    if (!isEmpty(validated.error.errors)) {
      return { success: false, message: validated.error.errors[0].message };
    }
    return { success: false, message: "Form validation error occured!!" };
  }
  const token = await sessionToken();
  try {
    const response = await fetch(
      `${API_BASE_URL}/rooms/update/${validated.data.id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token?.access}`,
        },
        body: JSON.stringify(formData),
      }
    );
    const json: UpdateRoomAdResponse = await response.json();
    if (json) return { ...json, success: response.ok };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Oops!! Something went wrong!" };
  }
  return {
    success: false,
    message: "Couldn't perform the update room ad action",
  };
};
