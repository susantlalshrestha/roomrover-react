import { merge } from "lodash";
import { NextAuthConfig } from "next-auth";

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
      if (user) token = merge(token, user);
      return token;
    },
    session({ session, token }) {
      if (session.user) session.user = merge(token);
      return session;
    },
  },
};

export default config;
