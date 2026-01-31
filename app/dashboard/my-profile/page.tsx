"use client";

import Sidebar from "@/app/components/layout/Sidebar";
import Button from "@/app/components/ui/Button";
import { useState } from "react";

type Profile = {
  fullname: string;
  email: string;
  phone: string;
  address: string;
  department: string;
  designation: string;
  salary: string;
  image: string;
};

export default function MyProfilePage() {
  const [open, setOpen] = useState(false);

  const [profile, setProfile] = useState<Profile>({
    fullname: "John Doe",
    email: "john.doe@example.com",
    phone: "1098162",
    address: "US",
    department: "Production",
    designation: "Employee",
    salary: "40000",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
  });

  const [form, setForm] = useState<Profile>(profile);

  const handleUpdate = () => {
    setProfile(form);
    setOpen(false);
  };

  const handleImageChange = (file: File) => {
    const url = URL.createObjectURL(file);
    setForm((prev) => ({ ...prev, image: url }));
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        {/* APP BAR */}
        <header className="relative h-14 flex items-center px-6 bg-gray-900/80 border-b border-white/10">
          <h1 className="absolute left-1/2 -translate-x-1/2 text-lg font-semibold">
            My Profile
          </h1>

          <div className="ml-auto">
            <button
              onClick={() => {
                setForm(profile);
                setOpen(true);
              }}
              className=" bg-[#EE2737] px-4 py-2 rounded hover:bg-gray-700"
            >
              Update
            </button>
          </div>
        </header>

        {/* CONTENT */}
        <main className="flex-1 px-10 py-8">
          {/* TOP INFO */}
          <div className="flex items-center gap-6 mb-12">
            <img
              src={profile.image}
              alt="Profile"
              className="w-28 h-28 rounded-full border-4 border-white"
            />

            <div>
              <h2 className="text-2xl font-bold">{profile.fullname}</h2>
              <p className="text-gray-300">{profile.email}</p>

              <span className="inline-block mt-2 bg-[#EE2737] px-4 py-1 rounded-full text-sm">
                {profile.designation}
              </span>
            </div>
          </div>

          {/* DETAILS */}
          <div className="max-w-3xl space-y-6">
            <Detail label="Phone" value={profile.phone} />
            <Detail label="Address" value={profile.address} />
            <Detail label="Department" value={profile.department} />
            <Detail label="Designation" value={profile.designation} />
            <Detail label="Salary" value={`$${profile.salary}`} />
          </div>
        </main>
      </div>

      {/* UPDATE DIALOG */}
      {open && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded-xl w-full max-w-md space-y-4 border border-white/10">
            <h2 className="text-lg font-semibold">Update Profile</h2>

            {/* IMAGE UPLOAD */}
            <div className="flex flex-col items-center gap-2">
              <img
                src={form.image}
                className="w-24 h-24 rounded-full border-4 border-white"
              />

              <label className="text-sm text-blue-400 cursor-pointer hover:underline">
                Change Photo
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageChange(file);
                  }}
                />
              </label>
            </div>

            <Input
              placeholder="Full Name"
              value={form.fullname}
              onChange={(v) => setForm({ ...form, fullname: v })}
            />

            <Input
              placeholder="Email"
              value={form.email}
              onChange={(v) => setForm({ ...form, email: v })}
            />

            <Input
              placeholder="Phone"
              value={form.phone}
              onChange={(v) =>
                setForm({
                  ...form,
                  phone: v.replace(/\D/g, ""),
                })
              }
            />

            <Input
              placeholder="Address"
              value={form.address}
              onChange={(v) => setForm({ ...form, address: v })}
            />

            <Input
              placeholder="Department"
              value={form.department}
              onChange={(v) => setForm({ ...form, department: v })}
            />

            <Input
              placeholder="Designation"
              value={form.designation}
              onChange={(v) => setForm({ ...form, designation: v })}
            />

            <Input
              type="number"
              placeholder="Salary"
              value={form.salary}
              onChange={(v) => setForm({ ...form, salary: v })}
            />

            <div className="flex justify-end gap-3 pt-3">
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600"
              >
                Cancel
              </button>
              <Button
                onClick={handleUpdate}
                className="w-full py-2 rounded-lg font-semibold"
              >
                Update Profile
              </Button>
              {/* <button
                  onClick={handleUpdate}
                  className="bg- px-4 py-2 rounded hover:bg-blue-700"
                >
                  Update
                </button> */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ================= HELPERS ================= */

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-10 border-b border-white/10 pb-3">
      <div className="w-40 text-gray-400 text-sm">{label}</div>
      <div className="flex-1">{value}</div>
    </div>
  );
}

function Input({
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  type?: string;
}) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-4 py-2 bg-gray-800 border border-white/10 rounded"
    />
  );
}
