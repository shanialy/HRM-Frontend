"use client";

import Sidebar from "@/app/components/layout/Sidebar";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Button from "@/app/components/ui/Button";

/* ================= TYPES ================= */
type Employee = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  department: string;
  designation: string;
  salary: string;
  image: string;
};

const PAGE_SIZE = 5;

/* ================= COMPONENT ================= */
export default function EmployeesListPage() {
  const router = useRouter();

  const [employees, setEmployees] = useState<Employee[]>([
    {
      id: 1,
      firstName: "John",
      lastName: "Smith",
      email: "john.smith@example.com",
      phone: "1234567890",
      address: "NY",
      department: "Engineering",
      designation: "Frontend Developer",
      salary: "5000",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
      id: 2,
      firstName: "Emily",
      lastName: "Johnson",
      email: "emily.johnson@example.com",
      phone: "9876543210",
      address: "CA",
      department: "Sales",
      designation: "Sales Executive",
      salary: "6500",
      image: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
      id: 3,
      firstName: "Alice",
      lastName: "Brown",
      email: "alice.brown@example.com",
      phone: "1112223333",
      address: "TX",
      department: "Marketing",
      designation: "Marketing Manager",
      salary: "5500",
      image: "https://randomuser.me/api/portraits/women/68.jpg",
    },
    {
      id: 4,
      firstName: "Bob",
      lastName: "Davis",
      email: "bob.davis@example.com",
      phone: "4445556666",
      address: "FL",
      department: "HR",
      designation: "HR Executive",
      salary: "4800",
      image: "https://randomuser.me/api/portraits/men/45.jpg",
    },
    {
      id: 5,
      firstName: "Carol",
      lastName: "Miller",
      email: "carol.miller@example.com",
      phone: "7778889999",
      address: "WA",
      department: "Engineering",
      designation: "Backend Developer",
      salary: "5200",
      image: "https://randomuser.me/api/portraits/women/22.jpg",
    },
    {
      id: 6,
      firstName: "David",
      lastName: "Wilson",
      email: "david.wilson@example.com",
      phone: "2223334444",
      address: "NV",
      department: "Sales",
      designation: "Sales Lead",
      salary: "7000",
      image: "https://randomuser.me/api/portraits/men/50.jpg",
    },
    {
      id: 7,
      firstName: "Eva",
      lastName: "Moore",
      email: "eva.moore@example.com",
      phone: "3334445555",
      address: "AZ",
      department: "Support",
      designation: "Support Engineer",
      salary: "4700",
      image: "https://randomuser.me/api/portraits/women/55.jpg",
    },
    {
      id: 8,
      firstName: "Frank",
      lastName: "Taylor",
      email: "frank.taylor@example.com",
      phone: "5556667777",
      address: "OR",
      department: "Finance",
      designation: "Accountant",
      salary: "5100",
      image: "https://randomuser.me/api/portraits/men/62.jpg",
    },
    {
      id: 9,
      firstName: "Grace",
      lastName: "Anderson",
      email: "grace.anderson@example.com",
      phone: "6667778888",
      address: "MI",
      department: "Engineering",
      designation: "Fullstack Developer",
      salary: "5800",
      image: "https://randomuser.me/api/portraits/women/33.jpg",
    },
    {
      id: 10,
      firstName: "Hank",
      lastName: "Thomas",
      email: "hank.thomas@example.com",
      phone: "8889990000",
      address: "OH",
      department: "Sales",
      designation: "Sales Executive",
      salary: "6400",
      image: "https://randomuser.me/api/portraits/men/12.jpg",
    },
  ]);

  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  const emptyForm: Employee = {
    id: 0,
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    department: "",
    designation: "",
    salary: "",
    image: "",
  };

  const [form, setForm] = useState<Employee>(emptyForm);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  /* ================= LOGIC ================= */
  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) =>
      `${emp.firstName} ${emp.lastName} ${emp.designation} ${emp.email}`
        .toLowerCase()
        .includes(search.toLowerCase()),
    );
  }, [employees, search]);

  const totalPages = Math.ceil(filteredEmployees.length / PAGE_SIZE);

  const paginatedEmployees = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredEmployees.slice(start, start + PAGE_SIZE);
  }, [filteredEmployees, page]);

  const handleImageChange = (file: File) => {
    const url = URL.createObjectURL(file);
    setForm((prev) => ({ ...prev, image: url }));
  };

  const handleSave = () => {
    if (!form.firstName || !form.designation || !form.email) return;

    if (editId !== null) {
      // update existing
      setEmployees((prev) =>
        prev.map((emp) => (emp.id === editId ? { ...emp, ...form } : emp)),
      );
    } else {
      // add new employee on top
      setEmployees((prev) => [{ ...form, id: Date.now() }, ...prev]);
    }

    setForm(emptyForm);
    setEditId(null);
    setOpen(false);
  };

  const handleEdit = (emp: Employee) => {
    setForm(emp);
    setEditId(emp.id);
    setOpen(true);
  };

  const handleDelete = (id: number) => {
    setEmployees((prev) => prev.filter((emp) => emp.id !== id));
  };

  /* ================= UI ================= */
  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        {/* APP BAR */}
        <div className="relative h-14 flex items-center px-6 bg-gray-900/80 border-b border-white/10">
          <h1 className="absolute left-1/2 -translate-x-1/2 text-lg font-semibold">
            Employees
          </h1>

          <div className="ml-auto flex gap-3">
            <input
              placeholder="Search..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="px-3 py-2 rounded bg-gray-800 border border-white/10"
            />
            <Button
              onClick={() => {
                setForm(emptyForm);
                setEditId(null);
                setOpen(true);
              }}
              className="w-full py-2 rounded-lg font-semibold"
            >
              + Add Employee
            </Button>
            {/* <button
                onClick={() => {
                  setForm(emptyForm);
                  setEditId(null);
                  setOpen(true);
                }}
                className="bg-gray-800 px-4 py-2 rounded"
              >
                + Add Employee */}
            {/* </button> */}
          </div>
        </div>

        {/* TABLE */}
        <main className="flex-1 p-6 flex flex-col gap-4">
          <div className="bg-gray-900/70 rounded-xl border border-white/10 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-800/80 text-gray-300">
                <tr>
                  <th className="px-4 py-3 text-left">Email</th>
                  <th className="px-4 py-3 text-left">Name</th>
                  <th className="px-4 py-3 text-left">Designation</th>
                  <th className="px-4 py-3 text-left">Department</th>
                  <th className="px-4 py-3 text-left">Salary</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>

              <tbody>
                {paginatedEmployees.map((emp) => (
                  <tr
                    key={emp.id}
                    className="border-t border-white/10 hover:bg-white/5 cursor-pointer"
                    onClick={() => {
                      const params = new URLSearchParams({
                        firstName: emp.firstName,
                        lastName: emp.lastName,
                        phone: emp.phone,
                        address: emp.address,
                        department: emp.department,
                        designation: emp.designation,
                        salary: emp.salary,
                        email: emp.email,
                        image: emp.image,
                      });
                      router.push(
                        `/dashboard/admin-dashboard/employes-list/view-employee-profile?${params.toString()}`,
                      );
                    }}
                  >
                    <td className="px-4 py-3">{emp.email}</td>
                    <td className="px-4 py-3 font-semibold">
                      {emp.firstName} {emp.lastName}
                    </td>
                    <td className="px-4 py-3 text-gray-300">
                      {emp.designation}
                    </td>
                    <td className="px-4 py-3 text-gray-300">
                      {emp.department}
                    </td>
                    <td className="px-4 py-3 text-green-400 font-medium">
                      ${emp.salary}
                    </td>
                    <td className="px-4 py-3 flex gap-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(emp);
                        }}
                        className="text-blue-400"
                      >
                        Edit
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(emp.id);
                        }}
                        className="text-red-400"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
          <div className="flex justify-end gap-2 mt-2">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              className="px-3 py-1 bg-gray-800 rounded"
            >
              Prev
            </button>

            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`px-3 py-1 rounded ${page === i + 1 ? "bg-[#EE2737]" : "bg-gray-800"}`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              className="px-3 py-1 bg-gray-800 rounded"
            >
              Next
            </button>
          </div>
        </main>

        {/* MODAL */}
        {open && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-gray-900 p-6 rounded-xl w-full max-w-md space-y-3">
              <div className="flex flex-col items-center gap-2">
                <img
                  src={form.image || "https://via.placeholder.com/100"}
                  className="w-24 h-24 rounded-full border-4 border-white object-cover"
                />
                <label className="text-blue-400 cursor-pointer text-sm">
                  Upload Photo
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

              <input
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-2 bg-gray-800 rounded"
              />
              <input
                placeholder="First Name"
                value={form.firstName}
                onChange={(e) =>
                  setForm({ ...form, firstName: e.target.value })
                }
                className="w-full px-4 py-2 bg-gray-800 rounded"
              />
              <input
                placeholder="Last Name"
                value={form.lastName}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                className="w-full px-4 py-2 bg-gray-800 rounded"
              />
              <input
                placeholder="Phone"
                value={form.phone}
                onChange={(e) =>
                  setForm({
                    ...form,
                    phone: e.target.value.replace(/\D/g, ""),
                  })
                }
                className="w-full px-4 py-2 bg-gray-800 rounded"
              />
              <input
                placeholder="Address"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="w-full px-4 py-2 bg-gray-800 rounded"
              />
              <input
                placeholder="Department"
                value={form.department}
                onChange={(e) =>
                  setForm({ ...form, department: e.target.value })
                }
                className="w-full px-4 py-2 bg-gray-800 rounded"
              />
              <input
                placeholder="Designation"
                value={form.designation}
                onChange={(e) =>
                  setForm({ ...form, designation: e.target.value })
                }
                className="w-full px-4 py-2 bg-gray-800 rounded"
              />
              <input
                placeholder="Salary"
                value={form.salary}
                onChange={(e) =>
                  setForm({
                    ...form,
                    salary: e.target.value.replace(/\D/g, ""),
                  })
                }
                className="w-full px-4 py-2 bg-gray-800 rounded"
              />

              <div className="flex justify-end gap-3 pt-3">
                <button onClick={() => setOpen(false)}>Cancel</button>
                <button
                  onClick={handleSave}
                  className="bg-blue-600 px-4 py-2 rounded"
                >
                  {editId ? "Update" : "Add"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
