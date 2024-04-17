import { merge } from "lodash";
import { NextAuthConfig } from "next-auth";
import { AuthUser } from "./auth";

const config: NextAuthConfig = {
  providers: [],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/auth/login",
  },
  callbacks: {
    signIn: () => {
      return true;
    },
    jwt: ({ user, token }) => {
      if (user) {
        const authUser = user as AuthUser;
        token.authUser = authUser;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) session.user = merge(token.authUser);
      return session;
    },
  },
};

export default config;
