import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const options = {
  // Configure authentication providers
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email: ", type: "email" },
        password: { label: "Password: ", type: "password" },
      },
      async authorize(credentials) {
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_WORDPRESS_SITE_URL}/?rest_route=/simple-jwt-login/v1/auth&email=${credentials.email}&password=${credentials.password}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                username: credentials.email,
                password: credentials.password,
              }),
            }
          );

          const response = await res.json();

          if (!res.ok || response.code) {
            throw new Error(response.message || "Invalid credentials");
          }

          // Extract JWT token and user data from response
          const token = response.data?.jwt || response.jwt;
          const userData = response.data || response;

          // Try to extract user ID from JWT token payload
          if (token) {
            try {
              const tokenParts = token.split(".");
              if (tokenParts.length === 3) {
                const tokenPayload = JSON.parse(
                  Buffer.from(tokenParts[1], "base64").toString()
                );

                if (tokenPayload.id) {
                  return {
                    id: tokenPayload.id,
                    name:
                      tokenPayload.username ||
                      userData.user_display_name ||
                      credentials.email,
                    email:
                      tokenPayload.email ||
                      userData.user_email ||
                      credentials.email,
                  };
                }
              }
            } catch (e) {
              // Continue with fallback if token parsing fails
            }
          }

          // Fallback to user ID from response data
          const userId =
            userData.id || userData.ID || userData.user_id || "unknown";

          return {
            id: userId,
            name:
              userData.username ||
              userData.user_display_name ||
              credentials.email,
            email: userData.email || userData.user_email || credentials.email,
          };
        } catch (error) {
          throw new Error(error.message || "Login failed");
        }
      },
    }),
  ],

  // Custom pages
  pages: {
    signIn: "/login",
    error: "/login",
  },

  // Callbacks for JWT and session handling
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = user;
        token.wordpress_user_id = user.id;
      }
      return token;
    },

    async session({ session, token }) {
      session.user = token.user || {};
      session.user.id = token.wordpress_user_id;
      return session;
    },
  },

  // Security settings
  // useSecureCookies: process.env.NODE_ENV === "production",
};
