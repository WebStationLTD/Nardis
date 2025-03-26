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

          console.log("WordPress API response:", JSON.stringify(response));
          if (!res.ok || response.code) {
            throw new Error(response.message || "Invalid credentials");
          }

          // The WordPress JWT plugin returns data in different formats depending on configuration
          // Let's handle all possible locations of the user ID
          const token = response.data?.jwt || response.jwt;
          const userData = response.data || response;
          
          // Log the token data to help debug
          if (token) {
            try {
              // Decode the JWT token to see what's inside
              const tokenParts = token.split('.');
              if (tokenParts.length === 3) {
                const tokenPayload = JSON.parse(Buffer.from(tokenParts[1], 'base64').toString());
                console.log("JWT payload:", JSON.stringify(tokenPayload));
                
                // If token has the ID, use it
                if (tokenPayload.id) {
                  console.log("Found user ID in token payload:", tokenPayload.id);
                  return {
                    id: tokenPayload.id,
                    name: tokenPayload.username || userData.user_display_name || credentials.email,
                    email: tokenPayload.email || userData.user_email || credentials.email,
                  };
                }
              }
            } catch (e) {
              console.log("Error decoding JWT token:", e);
            }
          }
          
          // Fallback to looking for ID in response data
          const userId = userData.id || userData.ID || userData.user_id || "unknown";
          console.log("Using user ID from response:", userId);
          
          return {
            id: userId,
            name: userData.username || userData.user_display_name || credentials.email,
            email: userData.email || userData.user_email || credentials.email,
          };
        } catch (error) {
          console.error("Authentication error:", error);
          throw new Error(error.message || "Login failed");
        }
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      // When signIn succeeds, user object is passed
      if (user) {
        // Store user info in the JWT token
        console.log("User object in JWT callback:", JSON.stringify(user));
        token.user = user;
        
        // Make sure we store the ID exactly as WordPress provides it
        token.wordpress_user_id = user.id;
        console.log("Setting wordpress_user_id in token:", token.wordpress_user_id);
      }
      return token;
    },
    async session({ session, token }) {
      // Make user info available in session
      session.user = token.user || {};
      
      // Store the WordPress user ID directly on the user object for easy access
      session.user.id = token.wordpress_user_id;
      
      console.log("Session user ID set to:", session.user.id);
      return session;
    },
  },
  debug: false,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  // Add site URL configuration
  useSecureCookies: process.env.NODE_ENV === "production",
  url: process.env.NEXTAUTH_URL || "http://localhost:3000",
};
