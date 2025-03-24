export { default } from "next-auth/middleware";

// Add protected routes here:
export const config = { matcher: ["/dashboard"] };