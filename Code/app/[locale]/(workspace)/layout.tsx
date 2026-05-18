import { ReactNode } from "react";
import { getUserInfo } from "@/services/user";
import { redirect } from "next/navigation";

export default async function WorkspaceLayout({
  children,
}: {
  children: ReactNode;
}) {
  const userInfo = await getUserInfo();
  if (!userInfo || !userInfo.email) {
    redirect("/auth/signin");
  }

  return (
    <div className="h-screen w-screen overflow-hidden bg-slate-950 text-slate-100 flex flex-col">
      {children}
    </div>
  );
}
