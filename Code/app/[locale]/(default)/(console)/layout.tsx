import ConsoleLayout from "@/components/console/layout";
import { ReactNode } from "react";
import { Sidebar } from "@/types/blocks/sidebar";
import { getUserInfo } from "@/services/user";
import { redirect } from "next/navigation";

export default async function ({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const userInfo = await getUserInfo();
  if (!userInfo || !userInfo.email) {
    redirect("/auth/signin");
  }

  const isZh = locale.toLowerCase().startsWith("zh");

  const sidebar: Sidebar = {
    nav: {
      items: [
        {
          title: isZh ? "首页" : "Home",
          url: "/",
          icon: "RiHome5Line",
          is_active: false,
        },
        {
          title: isZh ? "工作台" : "Console",
          url: "/forms",
          icon: "RiFileList3Line",
          is_active: false,
        },
        {
          title: isZh ? "技能仓库" : "Skills",
          url: "/skills",
          icon: "RiSparklingLine",
          is_active: false,
        },
        {
          title: isZh ? "模板库" : "Templates",
          url: "/templates",
          icon: "RiLayoutGridLine",
          is_active: false,
        },
        {
          title: isZh ? "资源中心" : "Resources",
          url: "/posts",
          icon: "RiArchiveLine",
          is_active: false,
        },
        {
          title: isZh ? "反馈支持" : "Support",
          url: "/support",
          icon: "RiCustomerService2Line",
          is_active: false,
        },
        {
          title: isZh ? "系统设置" : "Settings",
          url: "/settings",
          icon: "RiSettings3Line",
          is_active: false,
        },
      ],
    },
  };

  return <ConsoleLayout sidebar={sidebar}>{children}</ConsoleLayout>;
}
