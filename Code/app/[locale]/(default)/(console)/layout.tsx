import ConsoleLayout from "@/components/console/layout";
import { ReactNode } from "react";
import { Sidebar } from "@/types/blocks/sidebar";
import { getUserInfo } from "@/services/user";
import { redirect } from "next/navigation";

export default async function ({ children }: { children: ReactNode }) {
  const userInfo = await getUserInfo();
  if (!userInfo || !userInfo.email) {
    redirect("/auth/signin");
  }

  const sidebar: Sidebar = {
    nav: {
      items: [
        {
          title: "工作台",
          url: "/forms",
          icon: "RiFileList3Line",
          is_active: false,
        },
        {
          title: "资源中心",
          url: "/posts",
          icon: "RiArchiveLine",
          is_active: false,
        },
        {
          title: "系统设置",
          url: "/settings",
          icon: "RiSettings3Line",
          is_active: false,
        },
      ],
    },
  };

  return <ConsoleLayout sidebar={sidebar}>{children}</ConsoleLayout>;
}
