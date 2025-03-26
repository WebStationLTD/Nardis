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
          if (!credentials?.email || !credentials?.password) {
            throw new Error("Email and password are required");
          }

          const res = await fetch(
            `${process.env.NEXT_PUBLIC_WORDPRESS_SITE_URL}/?rest_route=/simple-jwt-login/v1/auth&email=${encodeURIComponent(credentials.email)}&password=${encodeURIComponent(credentials.password)}`,
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
            console.log("WordPress API error:", JSON.stringify(response));
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
                
                // If token has the ID, use it
                if (tokenPayload.id) {
                  return {
                    id: tokenPayload.id,
                    name: tokenPayload.username || userData.user_display_name || credentials.email,
                    email: tokenPayload.email || userData.user_email || credentials.email,
                    token: token, // Store token for future API requests
                  };
                }
              }
            } catch (e) {
              console.log("Error decoding JWT token:", e);
            }
          }
          
          // Fallback to looking for ID in response data
          const userId = userData.id || userData.ID || userData.user_id || "unknown";
          
          return {
            id: userId,
            name: userData.username || userData.user_display_name || credentials.email,
            email: userData.email || userData.user_email || credentials.email,
            token: token, // Store token for future API requests
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
    error: '/login', // Redirect to login page on error
    newUser: '/my-account', // Redirect new users after sign up
  },
  callbacks: {
    async jwt({ token, user, account }) {
      // When signIn succeeds, user object is passed
      if (user) {
        // Store user info in the JWT token
        token.user = {
          id: user.id,
          name: user.name,
          email: user.email,
        };
        
        // Make sure we store the ID exactly as WordPress provides it
        token.wordpress_user_id = user.id;
        
        // Store the JWT token for WordPress API requests
        token.access_token = user.token;
      }
      return token;
    },
    async session({ session, token }) {
      // Make user info available in session
      session.user = token.user || {};
      
      // Store the WordPress user ID directly on the user object for easy access
      session.user.id = token.wordpress_user_id;
      
      // Add token to session for API requests
      session.access_token = token.access_token;
      
      return session;
    },
  },
  // Enhanced security configs
  secret: process.env.NEXTAUTH_SECRET, // Make sure this is set in your env vars
  debug: process.env.NODE_ENV === "development",
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  // Cookie configuration
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
  // Site configuration 
  useSecureCookies: process.env.NODE_ENV === "production",
};
