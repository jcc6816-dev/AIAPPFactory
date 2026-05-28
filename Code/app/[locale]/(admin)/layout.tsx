import DashboardLayout from "@/components/dashboard/layout";
import Empty from "@/components/blocks/empty";
import { ReactNode } from "react";
import { Sidebar } from "@/types/blocks/sidebar";
import { getUserInfo } from "@/services/user";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isZh = locale === "zh";
  const userInfo = await getUserInfo();
  if (!userInfo || !userInfo.email) {
    redirect("/auth/signin");
  }

  const adminEmails = process.env.ADMIN_EMAILS?.split(",");
  if (!adminEmails?.includes(userInfo?.email)) {
    return <Empty message={isZh ? "无访问权限" : "No access"} />;
  }

  const sidebar: Sidebar = {
    brand: {
      title: "AI FormFactory",
      logo: {
        src: "/logo.png",
        alt: "AI FormFactory",
      },
      url: "/admin",
    },
    nav: {
      items: [
        {
          title: isZh ? "用户" : "Users",
          url: "/admin/users",
          icon: "RiUserLine",
        },
        {
          title: isZh ? "表单运营" : "Forms",
          url: "/admin/forms",
          icon: "RiFileList3Line",
        },
        {
          title: isZh ? "反馈" : "Support",
          url: "/admin/support",
          icon: "RiCustomerService2Line",
        },
        {
          title: isZh ? "健康检查" : "Health",
          url: "/admin/health",
          icon: "RiPulseLine",
        },
        {
          title: isZh ? "增长分析" : "Growth",
          url: "/admin/growth",
          icon: "RiLineChartLine",
        },
        {
          title: isZh ? "订单" : "Orders",
          icon: "RiOrderPlayLine",
          is_expand: true,
          children: [
            {
              title: isZh ? "付费订单" : "Paid Orders",
              url: "/admin/paid-orders",
            },
          ],
        },
        {
          title: isZh ? "文章" : "Posts",
          url: "/admin/posts",
          icon: "RiArticleLine",
        },
      ],
    },
    social: {
      items: [
        {
          title: "Home",
          url: "/",
          target: "_blank",
          icon: "RiHomeLine",
        },
        {
          title: "Github",
          url: "https://github.com/aiformfactory/aiformfactory",
          target: "_blank",
          icon: "RiGithubLine",
        },
        {
          title: "Discord",
          url: "https://discord.gg/HQNnrzjZQS",
          target: "_blank",
          icon: "RiDiscordLine",
        },
        {
          title: "X",
          url: "https://x.com/aiformfactory",
          target: "_blank",
          icon: "RiTwitterLine",
        },
      ],
    },
  };

  return <DashboardLayout sidebar={sidebar}>{children}</DashboardLayout>;
}
