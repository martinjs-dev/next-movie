import { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      isAdmin: boolean;
      favMovies: string[];
    } & DefaultSession["user"]
  }


  interface User {
    id: string;
    isAdmin: boolean;
    favMovies: string[];
  }

  interface JWT {
    id: string;
    isAdmin: boolean;
    favMovies: string[];
  }

}
