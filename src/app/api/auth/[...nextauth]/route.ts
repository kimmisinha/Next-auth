import { connectMongoDB } from "@/libs/mongodb";
import User from "@/models/user";
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { User as NextAuthUser } from "next-auth";

interface Credentials {
  email: string;
  password: string;
}

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {},

      async authorize(credentials: Credentials) {
        const { email, password } = credentials;

        try {
          await connectMongoDB();
          const user = await User.findOne({ email });

          if (!user) {
            throw new Error("Account has not been registered");
          }

          const passwordMatch = await bcrypt.compare(password, user.password);

          if (!passwordMatch) {
            throw new Error("Invalid password");
          }

          // Return user object with correct type
          return user as NextAuthUser;
        } catch (error) {
          console.error("Error during authorization:", error);
          throw new Error(error.message);
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET || "",
  pages: {
    signIn: "/",
  },
};

const handler = NextAuth(authOptions);

export const GET = handler;
export const POST = handler;
