import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const options = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
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
      async authorize(credentials) {
        try {
          const res = await fetch(
            `https://nardis.rosset.website/?rest_route=/simple-jwt-login/v1/auth&email=${credentials.email}&password=${credentials.password}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                username: credentials.email,
                password: credentials.password,
              }),
            }
          );

          const user = await res.json();

          if (!res.ok || user.code) {
            throw new Error(user.message || "Invalid credentials");
          }

          return user;
        } catch (error) {
          throw new Error(error.message || "Login failed");
        }
      },
    }),
  ],
};
