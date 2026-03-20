"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  X,
  User,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Calendar,
  Hash,
  AlertCircle,
  Trash2,
  ChevronDown,
  Users,
  CheckCircle2,
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
interface FormData {
  studentId: string;
  name: string;
  age: string;
  township: string;
  gender: string;
  email: string;
  phone: string;
  academicYear: number;
  majorId: string;
}
interface Props {
  showModal: boolean;
  editStudent: Student | null;
  form: FormData;
  majors: Major[];
  error: string;
  onFormChange: (form: FormData) => void;
  onSubmit: () => void;
  onClose: () => void;
  deleteId: number | null;
  onDeleteConfirm: (id: number) => void;
  onDeleteCancel: () => void;
  submitSuccess?: boolean;
}

const NAVY = "#1A365D";
const NAVY_DARK = "#0F172A";

const inputStyle = (focused: boolean): React.CSSProperties => ({
  backgroundColor: focused ? "#FFFFFF" : "#F8FAFC",
  border: `1.5px solid ${focused ? NAVY : "#E2E8F0"}`,
  color: NAVY,
  outline: "none",
  WebkitAppearance: "none",
  MozAppearance: "none",
});

// Field Wrapper
function Field({
  label,
  icon: Icon,
  children,
}: {
  label: string;
  icon: React.ElementType;
  children: (
    focused: boolean,
    handlers: { onFocus: () => void; onBlur: () => void },
  ) => React.ReactNode;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      <label className="block text-[10px] font-black uppercase tracking-[0.1em] mb-1.5 ml-1 text-slate-400">
        {label}
      </label>
      <div className="relative flex items-center">
        <Icon
          className="absolute left-4 w-4 h-4 transition-colors duration-200 pointer-events-none z-10"
          style={{ color: focused ? NAVY : "#94A3B8" }}
        />
        {children(focused, {
          onFocus: () => setFocused(true),
          onBlur: () => setFocused(false),
        })}
      </div>
    </div>
  );
}

// Portal Dropdown Panel
function PortalDropdown({
  anchorRef,
  open,
  panelId,
  children,
}: {
  anchorRef: React.RefObject<HTMLDivElement>;
  open: boolean;
  panelId: string;
  children: React.ReactNode;
}) {
  const [rect, setRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    if (open && anchorRef.current) {
      setRect(anchorRef.current.getBoundingClientRect());
    }
  }, [open, anchorRef]);

  if (!open || !rect) return null;

  return createPortal(
    <div
      data-portal-id={panelId}
      className="fixed z-[99999] rounded-2xl overflow-hidden shadow-xl border border-slate-100 bg-white py-1.5"
      style={{ top: rect.bottom + 8, left: rect.left, width: rect.width }}
    >
      {children}
    </div>,
    document.body,
  );
}

// Dropdown Item
function DropdownItem({
  label,
  isActive,
  onClick,
}: {
  label: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <div
      className="flex items-center justify-between px-4 py-2.5 text-[13px] font-semibold cursor-pointer transition-colors duration-150 mx-1.5 rounded-xl"
      style={{
        color: isActive ? NAVY : "#64748b",
        backgroundColor: isActive ? "#EFF6FF" : undefined,
      }}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
    >
      <span>{label}</span>
      {isActive && (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path
            d="M2 7L5.5 10.5L12 3.5"
            stroke="#1A365D"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </div>
  );
}

// Outside-click hook
function useOutsideClick(
  anchorRef: React.RefObject<HTMLDivElement>,
  portalId: string,
  onClose: () => void,
) {
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as Node;
      const portalEl = document.querySelector(`[data-portal-id="${portalId}"]`);
      const insideAnchor = anchorRef.current?.contains(target) ?? false;
      const insidePortal = portalEl?.contains(target) ?? false;
      if (!insideAnchor && !insidePortal) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [anchorRef, portalId, onClose]);
}

// Gender Dropdown
function GenderDropdown({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const ref = useRef<HTMLDivElement>(null!);

  useOutsideClick(ref, "gender-panel", () => {
    setOpen(false);
    setFocused(false);
  });

  return (
    <div>
      <label className="block text-[10px] font-black uppercase tracking-[0.1em] mb-1.5 ml-1 text-slate-400">
        Gender
      </label>
      <div className="relative" ref={ref}>
        <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none z-10">
          <Users
            className="w-4 h-4 transition-colors duration-200"
            style={{ color: focused || open ? NAVY : "#94A3B8" }}
          />
        </div>
        <button
          type="button"
          onClick={() => {
            setOpen((p) => !p);
            setFocused(true);
          }}
          className="hiu-no-ring w-full pl-11 pr-10 py-3 rounded-2xl text-sm font-bold cursor-pointer transition-all duration-200 text-left"
          style={inputStyle(focused || open)}
        >
          {value || (
            <span className="text-slate-400 font-medium">Select gender</span>
          )}
        </button>
        <ChevronDown
          className="absolute right-4 top-1/2 w-4 h-4 text-slate-400 pointer-events-none transition-transform duration-200"
          style={{
            transform: open
              ? "translateY(-50%) rotate(180deg)"
              : "translateY(-50%)",
          }}
        />
        <PortalDropdown anchorRef={ref} open={open} panelId="gender-panel">
          {["Male", "Female"].map((opt) => (
            <DropdownItem
              key={opt}
              label={opt}
              isActive={value === opt}
              onClick={() => {
                onChange(opt);
                setOpen(false);
                setFocused(false);
              }}
            />
          ))}
        </PortalDropdown>
      </div>
    </div>
  );
}

// Academic Major Dropdown
function MajorDropdown({
  value,
  majors,
  onChange,
}: {
  value: string;
  majors: Major[];
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const ref = useRef<HTMLDivElement>(null!);
  const selectedName = majors.find((m) => String(m.id) === value)?.name;

  useOutsideClick(ref, "major-panel", () => {
    setOpen(false);
    setFocused(false);
  });

  return (
    <div>
      <label className="block text-[10px] font-black uppercase tracking-[0.1em] mb-1.5 ml-1 text-slate-400">
        Academic Major
      </label>
      <div className="relative z-50" ref={ref}>
        <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none z-10">
          <GraduationCap
            className="w-4 h-4 transition-colors duration-200"
            style={{ color: focused || open ? NAVY : "#94A3B8" }}
          />
        </div>
        <button
          type="button"
          onClick={() => {
            setOpen((p) => !p);
            setFocused(true);
          }}
          className="hiu-no-ring w-full pl-11 pr-10 py-3 rounded-2xl text-sm font-bold cursor-pointer transition-all duration-200 text-left"
          style={inputStyle(focused || open)}
        >
          {selectedName ?? (
            <span className="text-slate-400 font-medium">
              Select a major department
            </span>
          )}
        </button>
        <ChevronDown
          className="absolute right-4 top-1/2 w-4 h-4 text-slate-400 pointer-events-none transition-transform duration-200"
          style={{
            transform: open
              ? "translateY(-50%) rotate(180deg)"
              : "translateY(-50%)",
          }}
        />
        {open && (
          <div
            data-portal-id="major-panel"
            className="absolute top-full left-0 mt-2 w-full rounded-2xl overflow-hidden shadow-xl border border-slate-100 bg-white py-1.5"
          >
            <div className="max-h-48 overflow-y-auto custom-scrollbar">
              {majors.map((m) => (
                <DropdownItem
                  key={m.id}
                  label={m.name}
                  isActive={String(m.id) === value}
                  onClick={() => {
                    onChange(String(m.id));
                    setOpen(false);
                    setFocused(false);
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function StudentModal({
  showModal,
  editStudent,
  form,
  majors,
  error,
  onFormChange,
  onSubmit,
  onClose,
  deleteId,
  onDeleteConfirm,
  onDeleteCancel,
  submitSuccess = false,
}: Props) {
  const [mounted, setMounted] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [ageError, setAgeError] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (submitSuccess) {
      setShowToast(true);
      const timer = setTimeout(() => {
        setShowToast(false);
        onClose();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [submitSuccess]);

  if (!mounted) return null;

  return createPortal(
    <>
      <style>{`
        .hiu-no-ring:focus { outline: none !important; border-color: #1A365D !important; }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
      `}</style>

      {showToast && (
        <div
          className="fixed top-6 left-1/2 -translate-x-1/2 z-[99999] flex items-center gap-3 text-white px-6 py-4 rounded-2xl shadow-2xl animate-bounce"
          style={{ backgroundColor: NAVY }}
        >
          <CheckCircle2 className="w-6 h-6 text-green-400" />
          <p className="font-bold">
            {editStudent
              ? "Student Updated Successfully!"
              : "Student Registered Successfully!"}
          </p>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-xl max-h-[92vh] overflow-hidden flex flex-col animate-in fade-in zoom-in duration-300">
            <div
              className="px-8 py-6 border-b border-slate-100 flex items-center justify-between"
              style={{
                background: "linear-gradient(to right, #ffffff, #f8faff)",
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="p-2 rounded-xl"
                  style={{ backgroundColor: `${NAVY}15` }}
                >
                  <User className="w-5 h-5" style={{ color: NAVY }} />
                </div>
                <div>
                  <h2
                    className="text-xl font-black tracking-tight"
                    style={{ color: NAVY }}
                  >
                    {editStudent
                      ? "Edit Student Profile"
                      : "New Student Registration"}
                  </h2>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Database Record Entry
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="p-8 overflow-y-auto custom-scrollbar flex-1">
              {error && (
                <div className="flex items-center gap-3 p-4 rounded-2xl mb-6 bg-rose-50 border border-rose-100 text-rose-600">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <p className="text-xs font-bold">{error}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-1">
                  <Field label="Student ID" icon={Hash}>
                    {(focused, handlers) => (
                      <input
                        type="text"
                        value={form.studentId}
                        onChange={(e) =>
                          onFormChange({ ...form, studentId: e.target.value })
                        }
                        placeholder="STU..."
                        autoComplete="off"
                        className="hiu-no-ring w-full pl-11 pr-4 py-3 rounded-2xl text-sm font-bold transition-all duration-200"
                        style={inputStyle(focused)}
                        {...handlers}
                      />
                    )}
                  </Field>
                </div>

                <div className="md:col-span-1">
                  <Field label="Full Name" icon={User}>
                    {(focused, handlers) => (
                      <input
                        type="text"
                        value={form.name}
                        onChange={(e) =>
                          onFormChange({ ...form, name: e.target.value })
                        }
                        placeholder="Enter full name"
                        autoComplete="off"
                        className="hiu-no-ring w-full pl-11 pr-4 py-3 rounded-2xl text-sm font-bold transition-all duration-200"
                        style={inputStyle(focused)}
                        {...handlers}
                      />
                    )}
                  </Field>
                </div>

                <div className="md:col-span-2">
                  <Field label="Email Address" icon={Mail}>
                    {(focused, handlers) => (
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) =>
                          onFormChange({ ...form, email: e.target.value })
                        }
                        placeholder="name@example.com"
                        autoComplete="off"
                        className="hiu-no-ring w-full pl-11 pr-4 py-3 rounded-2xl text-sm font-bold transition-all duration-200"
                        style={inputStyle(focused)}
                        {...handlers}
                      />
                    )}
                  </Field>
                </div>

                <div className="md:col-span-2">
                  <MajorDropdown
                    value={form.majorId}
                    majors={majors}
                    onChange={(v) => onFormChange({ ...form, majorId: v })}
                  />
                </div>

                <div>
                  <Field label="Age" icon={Calendar}>
                    {(focused: any, handlers: any) => (
                      <div className="w-full relative">
                        <input
                          type="number"
                          value={form.age}
                          onChange={(e) => {
                            const val = e.target.value;
                            onFormChange({ ...form, age: val });

                            if (val !== "") {
                              const num = parseInt(val);
                              if (num < 18 || num > 30) {
                                setAgeError("Age must be between 18 and 30");
                              } else {
                                setAgeError("");
                              }
                            }
                          }}
                          autoComplete="off"
                          className="hiu-no-ring w-full pl-11 pr-4 py-3 rounded-2xl text-sm font-bold transition-all duration-200"
                          style={inputStyle(focused)}
                          {...handlers}
                        />
                        {ageError && (
                          <p className="absolute -bottom-5 left-2 text-[10px] text-rose-500 font-bold mt-1.5 ml-2 uppercase tracking-wider animate-in fade-in duration-200">
                            {ageError}
                          </p>
                        )}
                      </div>
                    )}
                  </Field>
                </div>

                <GenderDropdown
                  value={form.gender}
                  onChange={(v) => onFormChange({ ...form, gender: v })}
                />

                <div>
                  <Field label="Phone" icon={Phone}>
                    {(focused, handlers) => (
                      <input
                        type="text"
                        value={form.phone}
                        onChange={(e) =>
                          onFormChange({ ...form, phone: e.target.value })
                        }
                        placeholder="09..."
                        autoComplete="off"
                        className="hiu-no-ring w-full pl-11 pr-4 py-3 rounded-2xl text-sm font-bold transition-all duration-200"
                        style={inputStyle(focused)}
                        {...handlers}
                      />
                    )}
                  </Field>
                </div>

                <div>
                  <Field label="Township" icon={MapPin}>
                    {(focused, handlers) => (
                      <input
                        type="text"
                        value={form.township}
                        onChange={(e) =>
                          onFormChange({ ...form, township: e.target.value })
                        }
                        placeholder="Location"
                        autoComplete="off"
                        className="hiu-no-ring w-full pl-11 pr-4 py-3 rounded-2xl text-sm font-bold transition-all duration-200"
                        style={inputStyle(focused)}
                        {...handlers}
                      />
                    )}
                  </Field>
                </div>
              </div>
            </div>

            <div className="p-8 bg-slate-50 border-t border-slate-100 flex gap-4">
              <button
                onClick={onClose}
                className="flex-1 py-4 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-500 hover:bg-slate-100 transition-all border border-slate-200 cursor-pointer active:scale-95"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (!ageError && form.age) {
                    onSubmit();
                  } else if (!form.age) {
                    setAgeError("Age is required");
                  }
                }}
                className="flex-1 py-4 rounded-2xl text-xs font-black uppercase tracking-widest text-white shadow-lg transition-all active:scale-95 cursor-pointer"
                style={{
                  background: `linear-gradient(to right, ${NAVY}, ${NAVY_DARK})`,
                }}
              >
                {editStudent ? "Update Records" : "Confirm Registration"}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-[2rem] shadow-2xl p-8 w-full max-w-sm text-center animate-in zoom-in duration-200">
            <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-5">
              <Trash2 className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-black mb-2" style={{ color: NAVY }}>
              Remove Record?
            </h2>
            <p className="text-sm font-medium text-slate-400 mb-8 px-4">
              This will permanently delete the student from the database. This
              action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={onDeleteCancel}
                className="flex-1 py-3.5 rounded-xl text-[11px] font-black uppercase tracking-widest text-slate-400 hover:bg-slate-50 transition-colors cursor-pointer active:scale-95"
              >
                Go Back
              </button>
              <button
                onClick={() => onDeleteConfirm(deleteId)}
                className="flex-1 py-3.5 rounded-xl text-[11px] font-black uppercase tracking-widest text-white bg-rose-600 hover:bg-rose-700 shadow-lg shadow-rose-200 transition-all cursor-pointer active:scale-95"
              >
                Delete Now
              </button>
            </div>
          </div>
        </div>
      )}
    </>,
    document.body,
  );
}
