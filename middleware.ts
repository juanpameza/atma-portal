import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login",
  },
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/documents/:path*",
    "/installation/:path*",
    "/monitoring/:path*",
    "/service/:path*",
    "/support/:path*",
  ],
};
