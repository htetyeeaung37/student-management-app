"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, useSpring, useTransform, animate } from "framer-motion";
import {
  LogOut,
  Users,
  GraduationCap,
  BookOpen,
  BarChart3,
  ArrowRight,
  Loader2,
} from "lucide-react";

function Counter({ value, color }: { value: number; color: string }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const controls = animate(0, value, {
      duration: 2,
      ease: "easeOut",
      onUpdate: (latest) => setDisplayValue(Math.floor(latest)),
    });
    return () => controls.stop();
  }, [value]);

  return <h3 className="text-5xl font-black" style={{ color }}>{displayValue}</h3>;
}

interface Major {
  name: string;
  students: any[];
}

export default function DashboardPage() {
  const router = useRouter();
  const [admin, setAdmin] = useState<{ name: string } | null>(null);
  const [totalStudents, setTotalStudents] = useState(0);
  const [totalMajors, setTotalMajors] = useState(0);
  const [studentsByMajor, setStudentsByMajor] = useState<Major[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  const colors = {
    navy: "#1A365D",
    navyDark: "#0F172A",
    gold: "#D4AF37",
    goldLight: "#FCE7D0",
    bg: "#F8FAFC",
    white: "#FFFFFF",
  };

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem("token");
    const adminData = localStorage.getItem("admin");
    if (!token) {
      router.push("/login");
      return;
    }
    if (adminData) setAdmin(JSON.parse(adminData));
    fetchStats(token);
  }, [router]);

  const fetchStats = async (token: string) => {
    try {
      const [studentsRes, majorsRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/students`),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/majors`),
      ]);
      const students = await studentsRes.json();
      const majors = await majorsRes.json();
      setTotalStudents(students.length);
      setTotalMajors(majors.length);
      setStudentsByMajor(majors);
    } catch {
      console.error("Failed to fetch data.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("admin");
    router.push("/login");
  };

  const majorColors = ["#1E40AF", "#B45309", "#047857", "#7E22CE", "#BE185D"];

  if (!mounted || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 animate-spin" style={{ color: colors.navy }} />
          <p className="text-sm font-bold tracking-widest uppercase" style={{ color: colors.navy }}>
            Preparing Dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-12" style={{ backgroundColor: colors.bg }}>
      <div
        className="w-full text-white pt-12 pb-20 px-6 sm:px-10 mb-[-60px]"
        style={{ background: `linear-gradient(135deg, ${colors.navyDark}, ${colors.navy})` }}
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }} 
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl md:text-4xl font-extrabold flex items-center gap-3">
              Welcome, {admin?.name} <span className="animate-pulse">👋</span>
            </h1>
            <p className="text-slate-300 mt-2 font-medium tracking-wide">
              Management Portal • Heritage International University
            </p>
          </motion.div>

          <button
            onClick={handleLogout}
            className="group flex items-center justify-center gap-2 px-6 py-2.5 rounded-full border border-white/20 hover:bg-white hover:text-slate-900 transition-all duration-300 font-bold text-sm shadow-lg cursor-pointer"
          >
            <LogOut className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            SIGN OUT
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-10">
        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {/* Total Students Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-[2rem] p-8 shadow-xl border border-slate-100 flex items-center justify-between group hover:scale-[1.02] transition-all duration-300"
          >
            <div>
              <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mb-1">Total Students</p>
              <Counter value={totalStudents} color={colors.navy} />
            </div>
            <div className="w-20 h-20 rounded-3xl flex items-center justify-center transition-all duration-500 group-hover:rotate-6" style={{ backgroundColor: "rgba(26, 54, 147, 0.05)" }}>
              <GraduationCap className="w-10 h-10" style={{ color: colors.navy }} />
            </div>
          </motion.div>

          {/* Total Majors Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white rounded-[2rem] p-8 shadow-xl border border-slate-100 flex items-center justify-between group hover:scale-[1.02] transition-all duration-300"
          >
            <div>
              <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mb-1">Active Departments</p>
              <Counter value={totalMajors} color={colors.gold} />
            </div>
            <div className="w-20 h-20 rounded-3xl flex items-center justify-center transition-all duration-500 group-hover:-rotate-6" style={{ backgroundColor: "rgba(212, 175, 55, 0.05)" }}>
              <BookOpen className="w-10 h-10" style={{ color: colors.gold }} />
            </div>
          </motion.div>
        </div>

        {/* Analytics Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="bg-white rounded-[2.5rem] shadow-2xl p-8 md:p-12 border border-slate-100"
        >
          <div className="flex items-center gap-3 mb-10">
            <div className="p-3 rounded-2xl" style={{ backgroundColor: colors.navy }}>
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-black tracking-tight" style={{ color: colors.navy }}>Enrollment Analytics</h2>
              <p className="text-sm text-slate-400 font-medium">Distribution across different academic majors</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8">
            {studentsByMajor.map((major, index) => {
              const count = major.students?.length || 0;
              const percent = totalStudents > 0 ? Math.round((count / totalStudents) * 100) : 0;
              const barColor = majorColors[index % majorColors.length];

              return (
                <div key={index} className="group">
                  <div className="flex justify-between items-end mb-3 px-1">
                    <div>
                      <span className="text-lg font-bold block" style={{ color: colors.navyDark }}>{major.name}</span>
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400">{count} Active Students</span>
                    </div>
                    <span className="text-xl font-black" style={{ color: barColor }}>{percent}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-4 overflow-hidden border border-slate-50 shadow-inner">
                    {/* Animated Progress Bar */}
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percent}%` }}
                      transition={{ duration: 1.5, ease: "easeOut", delay: 0.8 + (index * 0.1) }}
                      className="h-full rounded-full"
                      style={{
                        backgroundColor: barColor,
                        boxShadow: `0 4px 12px ${barColor}44`,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-16 flex justify-center">
            <button
              onClick={() => router.push("/students")}
              className="group flex items-center gap-4 text-white px-10 py-5 rounded-2xl font-black text-sm tracking-widest transition-all duration-300 shadow-2xl hover:shadow-blue-900/20 hover:translate-y-[-4px] active:scale-95 cursor-pointer"
              style={{ backgroundColor: colors.navy }}
            >
              <Users className="w-5 h-5" style={{ color: colors.gold }} />
              <span className="group-hover:text-amber-200 transition-colors">VIEW FULL STUDENT TABLE</span>
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-2 group-hover:text-amber-200 " />
            </button>
          </div>
        </motion.div>

        <p className="text-center text-[10px] font-bold text-slate-300 mt-12 tracking-[0.3em] uppercase">
          University Information Systems • Secure Admin Node
        </p>
      </div>
    </div>
  );
}