import { authOptions } from "@/pages/api/auth/authoptions";
import NextAuth from "next-auth";

export default NextAuth(authOptions);