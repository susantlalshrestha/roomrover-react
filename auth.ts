import NextAuth, { User } from "next-auth";
import config from "./auth.config";
import { Account, AuthToken, LoginResponse } from "@roomrover/app/models";
import Credentials, { CredentialInput } from "next-auth/providers/credentials";
import { API_BASE_URL } from "@roomrover/app/config";
import { merge } from "lodash";

export interface AuthUser
  extends User,
    Partial<Omit<Account, "email">>,
    Partial<AuthToken> {
  error?: { message: string; action?: string };
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
      console.log("AUTHORIZE", json.message);
      if (!response.ok) return null;
      if (!json.data?.account || !json.data?.token) return null;
      const user: AuthUser = merge(json.data.account, json.data.token);
      console.log(user);
      return user;
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
        return null;
      }
    }
    return null;
  },
});

export const { auth, signIn, signOut } = NextAuth({
  ...config,
  providers: [credentials],
});
