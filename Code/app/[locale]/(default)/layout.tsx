import Footer from "@/components/blocks/footer";
import Header from "@/components/blocks/header";
import ChromeVisibility from "@/components/console/chrome-visibility";
import { ReactNode } from "react";
import { getLandingPage } from "@/services/page";

export default async function DefaultLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const page = await getLandingPage(locale);

  return (
    <>
      <ChromeVisibility>
        {page.header && <Header header={page.header} />}
      </ChromeVisibility>
      <main className="overflow-x-hidden">{children}</main>
      <ChromeVisibility>
        {page.footer && <Footer footer={page.footer} />}
      </ChromeVisibility>
    </>
  );
}
