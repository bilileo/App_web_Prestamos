import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";
import { isRole, SESSION_MAX_AGE_SECONDS } from "../features/auth/constants";
import { loginSchema } from "../features/auth/validations/login";
 
export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: SESSION_MAX_AGE_SECONDS,
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credenciales",
      credentials: {
        email: { label: "Correo", type: "email" },
        password: { label: "Contraseña", type: "password" },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
 
        if (!parsed.success) {
          return null;
        }
 
        const user = await prisma.user.findUnique({
          where: { email: parsed.data.email },
        });
 
        if (!user) {
          return null;
        }
 
        const passwordMatches = await bcrypt.compare(
          parsed.data.password,
          user.passwordHash,
        );
 
        if (!passwordMatches) {
          return null;
        }
 
        return {
          id: String(user.id),
          name: user.name,
          email: user.email,
          role: isRole(user.role) ? user.role : "USER",
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = String(user.id);
        token.role = user.role;
      }
 
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
 
      return session;
    },
  },
};
