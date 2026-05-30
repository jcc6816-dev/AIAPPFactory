import { getOrdersByPaidEmail, getOrdersByUserUuid } from "@/models/order";
import { getUserEmail, getUserUuid } from "@/services/user";

import { TableColumn } from "@/types/blocks/table";
import TableSlot from "@/components/console/slots/table";
import { Table as TableSlotType } from "@/types/slots/table";
import { getLocale, getTranslations } from "next-intl/server";
import moment from "moment";
import { redirect } from "next/navigation";

export default async function () {
  const t = await getTranslations();
  const locale = await getLocale();
  const isZh = locale.toLowerCase().startsWith("zh");

  const user_uuid = await getUserUuid();
  const user_email = await getUserEmail();

  const callbackUrl = `/${locale}/my-orders`;
  if (!user_uuid) {
    redirect(`/auth/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`);
  }

  let orders = await getOrdersByUserUuid(user_uuid);
  if (!orders || orders.length === 0) {
    orders = await getOrdersByPaidEmail(user_email);
  }

  const columns: TableColumn[] = [
    { name: "order_no", title: t("my_orders.table.order_no") },
    { name: "paid_email", title: t("my_orders.table.email") },
    { name: "product_name", title: t("my_orders.table.product_name") },
    {
      name: "amount",
      title: t("my_orders.table.amount"),
      callback: (item: any) =>
        `${item.currency.toUpperCase() === "CNY" ? "¥" : "$"} ${
          item.amount / 100
        }`,
    },
    {
      name: "paid_at",
      title: t("my_orders.table.paid_at"),
      callback: (item: any) =>
        moment(item.paid_at).format("YYYY-MM-DD HH:mm:ss"),
    },
  ];

  const hasPaidOrder = orders && orders.length > 0;

  const toolbarItems = [
    ...(hasPaidOrder
      ? [
          {
            title: isZh ? "管理我的订阅" : "Manage Subscription",
            icon: "RiVipDiamondLine",
            url: `/api/billing/portal?locale=${locale}`,
            target: "_self",
          },
        ]
      : []),
    {
      title: t("my_orders.read_docs"),
      icon: "RiBookLine",
      url: "https://docs.aiformfactory.ai",
      target: "_blank",
      variant: "outline" as const,
    },
    {
      title: t("my_orders.join_discord"),
      icon: "RiDiscordFill",
      url: "https://discord.gg/HQNnrzjZQS",
      target: "_blank",
    },
  ];

  const table: TableSlotType = {
    title: t("my_orders.title"),
    description: t("my_orders.description"),
    toolbar: {
      items: toolbarItems,
    },
    columns: columns,
    data: orders,
    empty_message: t("my_orders.no_orders"),
  };

  return <TableSlot {...table} />;
}
