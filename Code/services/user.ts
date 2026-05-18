import { CreditsAmount, CreditsTransType } from "./credit";
import { findUserByEmail, findUserByUuid, insertUser } from "@/models/user";

import { User } from "@/types/user";
import { auth } from "@/auth";
import { getIsoTimestr, getOneYearLaterTimestr } from "@/lib/time";
import { getUserUuidByApiKey } from "@/models/apikey";
import { headers } from "next/headers";
import { hasSupabaseConfig } from "@/models/db";
import { increaseCredits } from "./credit";

export async function saveUser(user: User) {
  try {
    const existUser = await findUserByEmail(user.email);
    if (!existUser) {
      await insertUser(user);

      // increase credits for new user, expire in one year
      await increaseCredits({
        user_uuid: user.uuid || "",
        trans_type: CreditsTransType.NewUser,
        credits: CreditsAmount.NewUserGet,
        expired_at: getOneYearLaterTimestr(),
      });
    } else {
      user.id = existUser.id;
      user.uuid = existUser.uuid;
      user.created_at = existUser.created_at;
    }

    return user;
  } catch (e) {
    console.log("save user failed: ", e);
    throw e;
  }
}

export async function getUserUuid() {
  let user_uuid = "";

  const token = await getBearerToken();

  if (token) {
    // api key
    if (token.startsWith("sk-")) {
      const user_uuid = await getUserUuidByApiKey(token);

      return user_uuid || "";
    }
  }

  const session = await auth();
  if (session && session.user && session.user.uuid) {
    user_uuid = session.user.uuid;
  }

  return user_uuid;
}

export async function getBearerToken() {
  const h = await headers();
  const auth = h.get("Authorization");
  if (!auth) {
    return "";
  }

  return auth.replace("Bearer ", "");
}

export async function getUserEmail() {
  let user_email = "";

  const session = await auth();
  if (session && session.user && session.user.email) {
    user_email = session.user.email;
  }

  return user_email;
}

export async function getUserInfo() {
  let user_uuid = await getUserUuid();

  if (!user_uuid) {
    return;
  }

  const session = await auth();
  if (!hasSupabaseConfig()) {
    if (session?.user) {
      return {
        uuid: session.user.uuid || user_uuid,
        email: session.user.email || "",
        nickname: session.user.nickname || session.user.name || "",
        avatar_url: session.user.avatar_url || session.user.image || "",
        created_at: session.user.created_at || getIsoTimestr(),
      };
    }

    return;
  }

  const user = await findUserByUuid(user_uuid);

  return user;
}
