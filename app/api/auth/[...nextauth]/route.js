import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Email and Password",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "email@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const res = await fetch(`https://nardis.rosset.website/wp-json/jwt-auth/v1/token`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              username: credentials.email,
              password: credentials.password,
            }),
          });

          const user = await res.json();
          
          if (!res.ok || user.code) {
            throw new Error(user.message || "Invalid credentials");
          }

          return {
            id: user.user_id,
            name: user.user_display_name,
            email: user.user_email,
            token: user.token,
          };
        } catch (error) {
          throw new Error(error.message || "Login failed");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.accessToken = user.token; // Запазваме JWT токена от WP
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.accessToken = token.accessToken;
      return session;
    },
  },
  pages: {
    signIn: "/login", // Път към custom login страница
  },
  secret: process.env.NEXTAUTH_SECRET, // Генерирай с: openssl rand -base64 32
  session: { strategy: "jwt" },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
