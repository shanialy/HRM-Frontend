"use client";

import Sidebar from "@/app/components/layout/Sidebar";
import Button from "@/app/components/ui/Button";
import { useState, useMemo } from "react";

type Client = {
  id: number;
  name: string;
  email: string;
  city: string;
};

const PAGE_SIZE = 5;

export default function ClientsListPage() {
  const [clients, setClients] = useState<Client[]>([
    {
      id: 1,
      name: "James Wilson",
      email: "james.wilson@client.co.uk",
      city: "London",
    },
    {
      id: 2,
      name: "Oliver Brown",
      email: "oliver.brown@client.co.uk",
      city: "Manchester",
    },
    {
      id: 3,
      name: "Emily Clarke",
      email: "emily.clarke@client.co.uk",
      city: "Birmingham",
    },
    {
      id: 4,
      name: "Sophia Taylor",
      email: "sophia.taylor@client.co.uk",
      city: "Leeds",
    },
    {
      id: 5,
      name: "Harry Thompson",
      email: "harry.thompson@client.co.uk",
      city: "Liverpool",
    },
    {
      id: 6,
      name: "Olivia Evans",
      email: "olivia.evans@client.co.uk",
      city: "Glasgow",
    },
    {
      id: 7,
      name: "William Johnson",
      email: "william.johnson@client.co.uk",
      city: "Edinburgh",
    },
  ]);

  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState({ name: "", email: "", city: "" });

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filteredClients = useMemo(() => {
    return clients.filter(
      (c) =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase()) ||
        c.city.toLowerCase().includes(search.toLowerCase()),
    );
  }, [clients, search]);

  const totalPages = Math.ceil(filteredClients.length / PAGE_SIZE);

  const paginatedClients = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredClients.slice(start, start + PAGE_SIZE);
  }, [filteredClients, page]);

  const handleSave = () => {
    if (!form.name || !form.email || !form.city) return;

    if (editId !== null) {
      setClients((prev) =>
        prev.map((c) => (c.id === editId ? { ...c, ...form } : c)),
      );
    } else {
      setClients((prev) => [...prev, { id: Date.now(), ...form }]);
    }

    setForm({ name: "", email: "", city: "" });
    setEditId(null);
    setOpen(false);
  };

  const handleEdit = (c: Client) => {
    setForm({ name: c.name, email: c.email, city: c.city });
    setEditId(c.id);
    setOpen(true);
  };

  const handleDelete = (id: number) => {
    setClients((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        {/* APP BAR */}
        <div
          className="relative h-14 flex items-center px-6
                    bg-gray-900/80 backdrop-blur-md
                    border-b border-white/10 shadow-md"
        >
          <h1
            className="absolute left-1/2 -translate-x-1/2
                        text-lg font-semibold tracking-wide"
          >
            Clients
          </h1>

          <div className="ml-auto flex gap-3">
            <input
              placeholder="Search..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="px-3 py-2 rounded-lg text-sm
                            bg-gray-800 border border-white/10
                            focus:outline-none"
            />
            <Button
              onClick={() => {
                setForm({ name: "", email: "", city: "" });
                setEditId(null);
                setOpen(true);
              }}
              className="w-full py-2 rounded-lg font-semibold"
            >
              + Add Client
            </Button>
            {/* <button
              onClick={() => {
                setForm({ name: "", email: "", city: "" });
                setEditId(null);
                setOpen(true);
              }}
              className="bg-gray-800 hover:bg-gray-700
                            border border-white/10
                            px-4 py-2 rounded-lg text-sm transition"
            >
              + Add Client
            </button> */}
          </div>
        </div>

        {/* TABLE */}
        <main className="flex-1 p-6">
          <div
            className="overflow-x-auto
                        bg-gray-900/70 backdrop-blur-lg
                        rounded-xl shadow-2xl
                        border border-white/10"
          >
            <table className="w-full text-sm">
              <thead className="bg-gray-800/80 text-gray-300">
                <tr>
                  <th className="px-5 py-4 text-left">Name</th>
                  <th className="px-5 py-4 text-left">Email</th>
                  <th className="px-5 py-4 text-left">City</th>
                  <th className="px-5 py-4 text-left">Actions</th>
                </tr>
              </thead>

              <tbody>
                {paginatedClients.map((c) => (
                  <tr
                    key={c.id}
                    className="border-t border-white/10
                                        hover:bg-white/5 transition"
                  >
                    <td className="px-5 py-4 font-medium">{c.name}</td>
                    <td className="px-5 py-4 text-gray-300">{c.email}</td>
                    <td className="px-5 py-4 text-gray-300">{c.city}</td>
                    <td className="px-5 py-4 flex gap-4">
                      <button
                        onClick={() => handleEdit(c)}
                        className="text-blue-400 hover:text-blue-300"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(c.id)}
                        className="text-red-400 hover:text-red-300"
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
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm
                        flex items-center justify-center z-50"
          >
            <div
              className="bg-gray-900 w-full max-w-md p-6
                            rounded-2xl border border-white/10 shadow-2xl"
            >
              <h2 className="text-xl font-semibold mb-5">
                {editId ? "Edit Client" : "Add Client"}
              </h2>

              <input
                placeholder="Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full mb-3 px-4 py-2 rounded-lg
                                bg-gray-800 border border-white/10
                                focus:outline-none"
              />

              <input
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full mb-3 px-4 py-2 rounded-lg
                                bg-gray-800 border border-white/10
                                focus:outline-none"
              />

              <input
                placeholder="City"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className="w-full mb-5 px-4 py-2 rounded-lg
                                bg-gray-800 border border-white/10
                                focus:outline-none"
              />

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setOpen(false)}
                  className="px-4 py-2 rounded-lg
                                    bg-gray-700 hover:bg-gray-600"
                >
                  Cancel
                </button>

                <button
                  onClick={handleSave}
                  className="px-4 py-2 rounded-lg
                                    bg-blue-600 hover:bg-blue-700"
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
