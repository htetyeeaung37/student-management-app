"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";

export default function NavbarWrapper() {
  const pathname = usePathname();

  // Login page မှာ Navbar မပြဘူး
  if (pathname === "/login") return null;

  return <Navbar />;
}