import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

// Single hardcoded admin account from env vars — no public registration,
// no user table. See README for setup.
export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize(credentials) {
        const email = credentials?.email;
        const password = credentials?.password;

        if (
          typeof email !== "string" ||
          typeof password !== "string" ||
          !process.env.ADMIN_EMAIL ||
          !process.env.ADMIN_PASSWORD
        ) {
          return null;
        }

        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
          return { id: "admin", email };
        }

        return null;
      },
    }),
  ],
  pages: {
    signIn: "/admin/login",
  },
  session: { strategy: "jwt" },
  trustHost: true,
});
