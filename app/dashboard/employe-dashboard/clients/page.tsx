"use client";

import Sidebar from "@/app/components/layout/Sidebar";
import Button from "@/app/components/ui/Button";
import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  getRequest,
  postRequest,
  putRequest,
  deleteRequest,
} from "@/app/services/api";
import { navigateToChat } from "@/app/utills/chatNavigation";

type Client = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  phone: string;
  status?: string;
  createdAt?: string;
};

const PAGE_SIZE = 5;

export default function ClientsListPage() {
  const router = useRouter();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);

  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    phone: "",
  });

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // ================= FETCH CLIENTS =================
  const fetchClients = async (pageNumber = 1) => {
    try {
      setLoading(true);

      const res = await getRequest<{
        data: {
          clients: Client[];
          pagination: { totalPages: number };
        };
      }>(`client/myclients?page=${pageNumber}&limit=${PAGE_SIZE}`);

      setClients(res.data.data.clients || []);
      setTotalPages(res.data.data.pagination?.totalPages || 1);
    } catch (error) {
      console.error("Fetch Clients Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients(page);
  }, [page]);

  // ================= FILTER =================
  const filteredClients = useMemo(() => {
    if (!search) return clients;

    return clients.filter((c) =>
      `${c.firstName} ${c.lastName} ${c.email} ${c.address}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [clients, search]);

  // ================= SAVE CLIENT =================
  const handleSave = async () => {
    if (
      !form.firstName ||
      !form.lastName ||
      !form.email ||
      !form.address ||
      !form.phone
    ) {
      alert("All fields are required");
      return;
    }

    try {
      if (editId) {
        await putRequest(`client/update-clients/${editId}`, form);
      } else {
        await postRequest("client/create-client", form);
      }

      await fetchClients(page);

      setForm({
        firstName: "",
        lastName: "",
        email: "",
        address: "",
        phone: "",
      });

      setEditId(null);
      setOpen(false);
    } catch (error) {
      console.error("Save Client Error:", error);
    }
  };

  // ================= DELETE CLIENT =================
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this client?")) return;

    try {
      await deleteRequest(`client/deleteClient/${id}`);
      await fetchClients(page);
    } catch (error) {
      console.error("Delete Client Error:", error);
    }
  };

  // ================= EDIT =================
  const handleEdit = (c: Client) => {
    setForm({
      firstName: c.firstName,
      lastName: c.lastName,
      email: c.email,
      address: c.address,
      phone: c.phone,
    });

    setEditId(c._id);
    setOpen(true);
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        {/* APP BAR */}
        <div className="relative h-14 flex items-center px-6 bg-gray-900/80 border-b border-white/10">
          <h1 className="absolute left-1/2 -translate-x-1/2 text-lg font-semibold">
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
              className="px-3 py-2 rounded bg-gray-800 border border-white/10"
            />

            <Button
              onClick={() => {
                setForm({
                  firstName: "",
                  lastName: "",
                  email: "",
                  address: "",
                  phone: "",
                });
                setEditId(null);
                setOpen(true);
              }}
            >
              + Add Client
            </Button>
          </div>
        </div>

        {/* TABLE */}
        <main className="flex-1 p-6">
          <div className="bg-gray-900/70 rounded-xl border border-white/10 overflow-x-auto">
            {loading ? (
              <div className="p-6 text-center text-gray-400">
                Loading clients...
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-gray-800/80 text-gray-300">
                  <tr>
                    <th className="px-4 py-3 text-left">Name</th>
                    <th className="px-4 py-3 text-left">Email</th>
                    <th className="px-4 py-3 text-left">Address</th>
                    <th className="px-4 py-3 text-left">Phone</th>
                    <th className="px-4 py-3 text-left">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredClients.map((c) => (
                    <tr
                      key={c._id}
                      className="border-t border-white/10 hover:bg-white/5"
                    >
                      <td className="px-4 py-3">
                        {c.firstName} {c.lastName}
                      </td>
                      <td className="px-4 py-3">{c.email}</td>
                      <td className="px-4 py-3">{c.address}</td>
                      <td className="px-4 py-3">{c.phone}</td>
                      <td className="px-4 py-3 flex gap-3">
                        <button
                          onClick={() => navigateToChat(c._id, router)}
                          className="text-green-400 hover:text-green-300"
                        >
                          💬 Chat
                        </button>
                        <button
                          onClick={() => handleEdit(c)}
                          className="text-blue-400"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(c._id)}
                          className="text-red-400"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </main>
      </div>

      {/* ================= FULL SCREEN DIALOG ================= */}
      {open && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-gray-900 w-full h-full md:w-[500px] md:h-auto md:rounded-xl p-8 overflow-y-auto">
            <h2 className="text-2xl font-semibold mb-6">
              {editId ? "Update Client" : "Add Client"}
            </h2>

            <div className="space-y-4">
              <input
                placeholder="First Name"
                value={form.firstName}
                onChange={(e) =>
                  setForm({ ...form, firstName: e.target.value })
                }
                className="w-full px-4 py-3 rounded bg-gray-800 border border-gray-700"
              />

              <input
                placeholder="Last Name"
                value={form.lastName}
                onChange={(e) =>
                  setForm({ ...form, lastName: e.target.value })
                }
                className="w-full px-4 py-3 rounded bg-gray-800 border border-gray-700"
              />

              <input
                placeholder="Email"
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
                className="w-full px-4 py-3 rounded bg-gray-800 border border-gray-700"
              />

              <input
                placeholder="Address"
                value={form.address}
                onChange={(e) =>
                  setForm({ ...form, address: e.target.value })
                }
                className="w-full px-4 py-3 rounded bg-gray-800 border border-gray-700"
              />

              <input
                placeholder="Phone"
                value={form.phone}
                onChange={(e) =>
                  setForm({ ...form, phone: e.target.value })
                }
                className="w-full px-4 py-3 rounded bg-gray-800 border border-gray-700"
              />
            </div>

            <div className="flex justify-end gap-4 mt-8">
              <button
                onClick={() => setOpen(false)}
                className="px-6 py-3 bg-gray-700 rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleSave}
                className="px-6 py-3 bg-[#EE2737] rounded"
              >
                {editId ? "Update Client" : "Save Client"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
