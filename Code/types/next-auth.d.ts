import "next-auth";

declare module "next-auth" {
  interface JWT {
    auth_conversion_event?: {
      id: string;
      type: "login" | "sign_up";
    };
    user?: {
      uuid?: string;
      email?: string;
      nickname?: string;
      avatar_url?: string;
      created_at?: string;
    };
  }

  interface Session {
    auth_conversion_event?: {
      id: string;
      type: "login" | "sign_up";
    };
    user: {
      uuid?: string;
      email?: string;
      nickname?: string;
      avatar_url?: string;
      created_at?: string;
    } & DefaultSession["user"];
  }
}
