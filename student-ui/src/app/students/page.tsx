"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Users,
  UserPlus,
  Search,
  Filter,
  X,
  Loader2,
  GraduationCap,
  ChevronDown,
  CheckCircle2,
} from "lucide-react";
import StudentTable from "@/components/StudentTable";
import StudentModal from "@/components/StudentModal";

interface Major {
  id: number;
  name: string;
}
interface Student {
  id: number;
  studentId: string;
  name: string;
  age: number;
  township: string;
  gender: string;
  email: string;
  phone: string;
  academicYear: number;
  majorId: number;
  major: Major;
}

const emptyForm = {
  studentId: "",
  name: "",
  age: "",
  township: "",
  gender: "",
  email: "",
  phone: "",
  academicYear: new Date().getFullYear(),
  majorId: "",
};

export default function StudentsPage() {
  const router = useRouter();
  const [students, setStudents] = useState<Student[]>([]);
  const [majors, setMajors] = useState<Major[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editStudent, setEditStudent] = useState<Student | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [search, setSearch] = useState("");
  const [selectedMajor, setSelectedMajor] = useState("");
  const [error, setError] = useState("");
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [searchFocused, setSearchFocused] = useState(false);
  const [majorFocused, setMajorFocused] = useState(false);
  const [majorOpen, setMajorOpen] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setMajorOpen(false);
        setMajorFocused(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    fetchData();
  }, [router]);

  const fetchData = async () => {
    try {
      const [studentsRes, majorsRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/students`),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/majors`),
      ]);
      setStudents(await studentsRes.json());
      setMajors(await majorsRes.json());
    } catch {
      console.error("Failed to fetch data.");
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditStudent(null);
    setForm(emptyForm);
    setError("");
    setSubmitSuccess(false);
    setShowModal(true);
  };

  const openEditModal = (student: Student) => {
    setEditStudent(student);
    setForm({
      studentId: student.studentId,
      name: student.name,
      age: String(student.age),
      township: student.township,
      gender: student.gender,
      email: student.email,
      phone: student.phone,
      academicYear: student.academicYear,
      majorId: String(student.majorId),
    });
    setError("");
    setSubmitSuccess(false);
    setShowModal(true);
  };

  const handleSubmit = async () => {
    setError("");
    const body = {
      ...form,
      age: Number(form.age),
      academicYear: Number(form.academicYear),
      majorId: Number(form.majorId),
    };
    try {
      const url = editStudent
        ? `${process.env.NEXT_PUBLIC_API_URL}/students/${editStudent.id}`
        : `${process.env.NEXT_PUBLIC_API_URL}/students`;
      const res = await fetch(url, {
        method: editStudent ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        setSubmitSuccess(true);
        fetchData();
        setTimeout(() => {
          setSubmitSuccess(false);
          setShowModal(false);
        }, 2000);
      } else {
        const data = await res.json();
        setError(data.message || "Operation failed.");
      }
    } catch {
      setError("Operation failed.");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/students/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setDeleteId(null);
      fetchData();
      setDeleteSuccess(true);
      setTimeout(() => setDeleteSuccess(false), 2000);
    } catch {
      console.error("Delete failed.");
    }
  };

  const filtered = students.filter((s) => {
    const matchSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.studentId.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase());
    const matchMajor = selectedMajor ? s.majorId === Number(selectedMajor) : true;
    return matchSearch && matchMajor;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-10 h-10 animate-spin text-slate-400" />
      </div>
    );
  }

  const NAVY = "#1A365D";
  const NAVY_LIGHT = "#CBD5E0";
  const BORDER_DEFAULT = "#E2E8F0";
  const BG_DEFAULT = "#F8FAFC";

  const inputStyle = (focused: boolean): React.CSSProperties => ({
    backgroundColor: focused ? "#FFFFFF" : BG_DEFAULT,
    border: `1.5px solid ${focused ? NAVY : BORDER_DEFAULT}`,
    color: NAVY,
    outline: "none",
    boxShadow: "none",
  });

  const selectedMajorName = majors.find((m) => String(m.id) === selectedMajor)?.name;

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* ─── Delete Success Toast ─────────────────────────────── */}
      {deleteSuccess && (
        <div
          className="fixed top-6 left-1/2 -translate-x-1/2 z-[99999] flex items-center gap-3 text-white px-6 py-4 rounded-2xl shadow-2xl animate-bounce"
          style={{ backgroundColor: "#1A365D" }}
        >
          <CheckCircle2 className="w-6 h-6 text-green-400" />
          <p className="font-bold">Student Deleted Successfully!</p>
        </div>
      )}

      <style>{`
        .no-focus-ring:focus {
          outline: none !important;
          box-shadow: none !important;
          border-color: #1A365D !important;
        }
        .dropdown-item:hover { background-color: #F1F5F9; }
      `}</style>

      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-10">
        {/* --- Header --- */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-[#1A365D]/10">
                <Users className="w-6 h-6 text-[#1A365D]" />
              </div>
              <h1 className="text-3xl font-black tracking-tight text-[#1A365D]">
                Student Directory
              </h1>
            </div>
            <p className="text-slate-500 font-medium">Managing students from database</p>
          </div>

          <button
            onClick={openAddModal}
            className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl text-white font-bold text-sm shadow-xl transition-all duration-300 hover:scale-[1.02] active:scale-95 bg-gradient-to-r from-[#1A365D] to-[#0F172A] cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            REGISTER NEW STUDENT
          </button>
        </div>

        {/* --- Filters --- */}
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 mb-8">
          <div className="flex flex-col lg:flex-row items-center gap-4">
            {/* Search Box */}
            <div className="relative w-full lg:flex-1">
              <input
                type="text"
                placeholder="Search by ID, Name or Email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                autoComplete="off"
                className="no-focus-ring w-full pl-11 pr-12 py-3.5 rounded-2xl text-sm transition-all duration-300"
                style={inputStyle(searchFocused)}
              />
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-200"
                style={{ color: searchFocused ? NAVY : NAVY_LIGHT }}
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-slate-200 cursor-pointer"
                >
                  <X className="w-3 h-3 text-slate-500" />
                </button>
              )}
            </div>

            {/* Major Filter Dropdown */}
            <div className="relative w-full lg:w-[280px]" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => { setMajorOpen((prev) => !prev); setMajorFocused(true); }}
                className="no-focus-ring w-full pl-14 pr-10 py-3.5 rounded-2xl text-[13px] font-bold cursor-pointer transition-all duration-300 text-left"
                style={inputStyle(majorFocused || majorOpen)}
              >
                {selectedMajorName ?? "All Departments"}
              </button>
              <div
                className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none transition-colors duration-200"
                style={{ color: majorFocused || majorOpen ? NAVY : NAVY_LIGHT }}
              >
                <Filter size={16} />
                <div className="w-[1px] h-4 bg-slate-200" />
              </div>
              <ChevronDown
                className="absolute right-4 top-1/2 w-4 h-4 text-slate-400 pointer-events-none transition-transform duration-200"
                style={{ transform: majorOpen ? "translateY(-50%) rotate(180deg)" : "translateY(-50%)" }}
              />
              {majorOpen && (
                <div className="absolute z-50 mt-2 w-full rounded-2xl overflow-hidden shadow-xl border border-slate-100 bg-white py-1.5">
                  {majors.map((m) => {
                    const isActive = selectedMajor === String(m.id);
                    return (
                      <div
                        key={m.id}
                        className="dropdown-item flex items-center justify-between px-4 py-2.5 text-[13px] font-semibold cursor-pointer transition-colors duration-150 mx-1.5 rounded-xl"
                        style={{ color: isActive ? NAVY : "#64748b", backgroundColor: isActive ? "#EFF6FF" : undefined }}
                        onClick={() => { setSelectedMajor(String(m.id)); setMajorOpen(false); setMajorFocused(false); }}
                      >
                        <span>{m.name}</span>
                        {isActive && (
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M2 7L5.5 10.5L12 3.5" stroke="#1A365D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {(search || selectedMajor) && (
              <button
                onClick={() => { setSearch(""); setSelectedMajor(""); }}
                className="w-full lg:w-auto px-6 py-3.5 rounded-2xl text-xs font-black tracking-widest uppercase transition-all duration-300 border border-slate-200 hover:bg-slate-50 active:scale-95 text-[#1A365D] cursor-pointer"
              >
                Reset Filters
              </button>
            )}
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-[2.5rem] shadow-xl overflow-hidden border border-slate-100">
          <StudentTable
            students={filtered}
            onEdit={openEditModal}
            onDelete={(id) => setDeleteId(id)}
          />
        </div>

        {/* Footer */}
        <div className="mt-8 flex items-center justify-center gap-2 text-slate-300">
          <GraduationCap className="w-4 h-4" />
          <p className="text-[10px] font-bold tracking-[0.3em] uppercase">
            Heritage International University Admin Node
          </p>
        </div>
      </div>

      <StudentModal
        showModal={showModal}
        editStudent={editStudent}
        form={form}
        majors={majors}
        error={error}
        onFormChange={setForm}
        onSubmit={handleSubmit}
        onClose={() => { setShowModal(false); setSubmitSuccess(false); }}
        deleteId={deleteId}
        onDeleteConfirm={handleDelete}
        onDeleteCancel={() => setDeleteId(null)}
        submitSuccess={submitSuccess}
      />
    </div>
  );
}