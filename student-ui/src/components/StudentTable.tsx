"use client";

import {
  Edit3,
  Trash2,
  User,
  MapPin,
  Phone,
  GraduationCap,
  Mail,
} from "lucide-react";

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

interface Props {
  students: Student[];
  onEdit: (student: Student) => void;
  onDelete: (id: number) => void;
}

export default function StudentTable({ students, onEdit, onDelete }: Props) {
  const colors = {
    navy: "#1A365D",
    navyDark: "#0F172A",
    gold: "#D4AF37",
    goldLight: "#FCE7D0",
  };

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr
            className="text-white uppercase text-[11px] tracking-[0.15em] font-black"
            style={{
              background: `linear-gradient(to right, ${colors.navyDark}, ${colors.navy})`,
            }}
          >
            <th className="px-6 py-5">Student Details</th>
            <th className="px-6 py-5">Gender</th>
            <th className="px-6 py-5">Academic Info</th>
            <th className="px-6 py-5">Age</th>
            <th className="px-6 py-5">Contact</th>
            <th className="px-6 py-5">Location</th>
            <th className="px-6 py-5 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {students.length === 0 ? (
            <tr>
              <td colSpan={7} className="text-center py-20 bg-white">
                <div className="flex flex-col items-center gap-2 opacity-30">
                  <User size={48} />
                  <p className="font-bold uppercase tracking-widest text-xs">
                    No Records Found
                  </p>
                </div>
              </td>
            </tr>
          ) : (
            students.map((student) => (
              <tr
                key={student.id}
                className="bg-white hover:bg-slate-50/80 transition-colors"
              >
                {/* Student ID & Name */}
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span
                      className="text-sm font-black tracking-tight"
                      style={{ color: colors.navy }}
                    >
                      {student.name}
                    </span>
                    <span className="text-[11px] font-bold text-slate-400">
                      ID: {student.studentId}
                    </span>
                  </div>
                </td>

                {/* Gender Badge */}
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      student.gender === "Male"
                        ? "bg-blue-50 text-blue-600 border border-blue-100"
                        : "bg-rose-50 text-rose-600 border border-rose-100"
                    }`}
                  >
                    {student.gender}
                  </span>
                </td>

                {/* Major & Year */}
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1.5">
                      <GraduationCap
                        size={12}
                        style={{ color: colors.gold }}
                      />
                      <span className="text-xs font-bold text-slate-700">
                        {student.major?.name}
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400">
                      Year: {student.academicYear}
                    </span>
                  </div>
                </td>

                {/* Age */}
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center">
                    <span className="text-xs font-bold text-slate-700" style={{ color: colors.navy }}>
                      {student.age}
                    </span>
                  </div>
                </td>

                {/* Contact — phone + email */}
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-slate-600">
                      <Phone size={12} />
                      <span className="text-xs font-medium">{student.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400">
                      <Mail size={12} />
                      <span className="text-xs font-medium">{student.email}</span>
                    </div>
                  </div>
                </td>

                {/* Location */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <MapPin size={12} />
                    <span className="text-xs font-semibold uppercase tracking-tight">
                      {student.township}
                    </span>
                  </div>
                </td>

                {/* Action Buttons */}
                <td className="px-6 py-4">
                  <div className="flex justify-center items-center gap-2">
                    <button
                      onClick={() => onEdit(student)}
                      className="p-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-amber-100 hover:text-amber-700 hover:shadow-sm transition-all duration-300 group/edit cursor-pointer"
                      title="Edit Student"
                    >
                      <Edit3
                        size={14}
                        className="group-hover/edit:scale-110 transition-transform"
                      />
                    </button>
                    <button
                      onClick={() => onDelete(student.id)}
                      className="cursor-pointer p-2 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white transition-all duration-300"
                      title="Delete Student"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}