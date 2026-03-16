"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { GraduationCap, LayoutDashboard, Users, Menu, X } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const navLinks = [
    { href: "/dashboard", label: "Dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
    { href: "/students", label: "Students", icon: <Users className="w-4 h-4" /> },
  ];

  if (!mounted) return null;

  // Theme Colors
  const colors = {
    navy: "#1A365D",
    navyDark: "#0F172A",
    gold: "#D4AF37",
    goldLight: "#FCE7D0",
  };

  return (
    <nav 
      className="sticky top-0 z-50 shadow-xl border-b border-white/10"
      style={{ background: `linear-gradient(to right, ${colors.navyDark}, ${colors.navy})` }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Left Side — Logo & Brand */}
          <div className="flex items-center gap-4 group cursor-pointer">
            <div 
              className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-300 group-hover:animate-bounce-short"
              style={{ 
                backgroundColor: "rgba(212, 175, 55, 0.15)", 
                border: `1px solid ${colors.gold}44` 
              }}
            >
              <GraduationCap className="w-7 h-7" style={{ color: colors.gold }} />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xl tracking-tight text-white leading-tight">
                HERITAGE
              </span>
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase" style={{ color: colors.gold }}>
                International University
              </span>
            </div>
          </div>

          {/* Right Side — Desktop Navigation */}
          <div className="hidden md:flex items-center gap-3">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 flex items-center gap-2 group overflow-hidden"
                  style={{
                    color: isActive ? colors.gold : colors.goldLight,
                    backgroundColor: isActive ? "rgba(212, 175, 55, 0.1)" : "transparent"
                  }}
                >
                  {link.icon}
                  {link.label}
                  
                  {/* Underline Indicator */}
                  <div 
                    className={`absolute bottom-0 left-0 h-0.5 bg-current transition-all duration-500 ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}`}
                    style={{ backgroundColor: colors.gold }}
                  />
                </Link>
              );
            })}
          </div>

          {/* Mobile — Toggle Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2.5 rounded-xl transition-all duration-200 cursor-pointer"
              style={{ backgroundColor: "rgba(255,255,255,0.05)", color: colors.gold }}
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div 
        className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out`}
        style={{ 
          maxHeight: menuOpen ? "200px" : "0", 
          opacity: menuOpen ? 1 : 0,
          backgroundColor: colors.navyDark,
          borderTop: menuOpen ? "1px solid rgba(255,255,255,0.05)" : "none"
        }}
      >
        <div className="px-6 py-6 space-y-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-4 px-5 py-4 rounded-2xl text-base font-bold transition-all duration-300"
                style={{
                  backgroundColor: isActive ? "rgba(212, 175, 55, 0.15)" : "transparent",
                  color: isActive ? colors.gold : colors.goldLight,
                }}
              >
                {link.icon}
                {link.label}
              </Link>
            );
          })}
        </div>
      </div>

      <style jsx global>{`
        @keyframes bounce-short {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .group-hover\:animate-bounce-short:hover {
          animation: bounce-short 0.6s ease-in-out infinite;
        }
      `}</style>
    </nav>
  );
}