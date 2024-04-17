import NextAuth, { User } from "next-auth";
import config from "./auth.config";
import { LoginResponse } from "@roomrover/app/models";
import Credentials, { CredentialInput } from "next-auth/providers/credentials";
import { API_BASE_URL } from "@roomrover/app/config";
import AppAuthError from "./auth-error";

export interface AuthUser extends User {
  auth: LoginResponse;
  isLoggedIn: boolean;
}

const credentials = Credentials<Record<"email" | "password", CredentialInput>>({
  name: "Credentials",
  type: "credentials",
  credentials: {
    email: {
      label: "Email: ",
      type: "email",
    },
    password: {
      label: "Password: ",
      type: "password",
    },
  },
  authorize: async (credentials): Promise<AuthUser | null> => {
    if (!credentials) return null;
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });
      const json: LoginResponse = await response.json();
      if (!json.data?.account || !json.data.token) {
        throw new AppAuthError(json.message || "Login Failed", json.action);
      }
      const user: AuthUser = {
        ...json.data.account,
        auth: json,
        isLoggedIn: true,
      };
      user.auth = json;
      return user;
    } catch (error) {
      if (error instanceof AppAuthError) {
        throw error;
      }
      throw new AppAuthError("Network Error!!");
    }
  },
});

export const { auth, signIn, signOut } = NextAuth({
  ...config,
  providers: [credentials],
});
