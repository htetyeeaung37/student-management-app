import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import NavbarWrapper from "@/components/NavbarWrapper";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "HIU Student University",
  description: "Student Management System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={geist.className}>
        <NavbarWrapper />
        <main>{children}</main>
      </body>
    </html>
  );
}