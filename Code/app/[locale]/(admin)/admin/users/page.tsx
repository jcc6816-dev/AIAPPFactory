import { TableColumn } from "@/types/blocks/table";
import TableSlot from "@/components/dashboard/slots/table";
import { Table as TableSlotType } from "@/types/slots/table";
import { getUsers } from "@/models/user";
import Link from "next/link";
import moment from "moment";

export default async function AdminUsersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isZh = locale === "zh";
  const users = await getUsers(1, 50);

  const columns: TableColumn[] = [
    { name: "uuid", title: "UUID" },
    {
      name: "email",
      title: isZh ? "邮箱" : "Email",
      callback: (row) => (
        <Link
          href={`/${locale}/admin/users/${row.uuid}`}
          className="font-bold text-brand-blue hover:underline"
        >
          {row.email}
        </Link>
      ),
    },
    { name: "nickname", title: isZh ? "名称" : "Name" },
    {
      name: "avatar_url",
      title: isZh ? "头像" : "Avatar",
      callback: (row) =>
        row.avatar_url ? (
          <img
            src={row.avatar_url}
            alt={row.nickname || row.email || "User avatar"}
            className="w-10 h-10 rounded-full"
          />
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-500">
            {(row.nickname || row.email || "U").slice(0, 1).toUpperCase()}
          </div>
        ),
    },
    {
      name: "created_at",
      title: isZh ? "注册时间" : "Created At",
      callback: (row) => moment(row.created_at).format("YYYY-MM-DD HH:mm:ss"),
    },
  ];

  const table: TableSlotType = {
    title: isZh ? "全部用户" : "All Users",
    columns,
    data: users || [],
  };

  return <TableSlot {...table} />;
}
