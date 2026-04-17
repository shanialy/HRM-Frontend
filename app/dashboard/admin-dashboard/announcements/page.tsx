"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/app/components/layout/Sidebar";
import {
  postRequest,
  getRequest,
  putRequest,
  deleteRequest,
} from "@/app/services/api";

export default function AdminAnnouncementsPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const formatPKT = (dateString: string) => {
    if (!dateString) return "No date";

    const date = new Date(dateString);

    return date.toLocaleString("en-PK", {
      timeZone: "Asia/Karachi",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const handlePublish = async () => {
    if (!title || !description) {
      alert("Title aur Description required hai");
      return;
    }

    try {
      const res = await postRequest("/announcements/createAnnouncement", {
        title,
        description,
      });

      const data: any = res?.data;

      if (data?.success) {
        setTitle("");
        setDescription("");
        getAnnouncements();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getAnnouncements = async () => {
    try {
      setLoading(true);

      const res = await getRequest(
        `/announcements/getAnnouncements?page=${page}&limit=15`,
      );

      const data: any = res?.data;

      if (data?.success) {
        const list =
          data?.data?.announcements || data?.data || data?.announcements || [];

        setAnnouncements(Array.isArray(list) ? list : []);
      }
    } catch (err) {
      console.error("GET ERROR:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAnnouncements();
  }, [page]);

  const handleDelete = async (id: string) => {
    try {
      await deleteRequest(`/announcements/deleteAnnouncement/${id}`);
      setAnnouncements((prev) => prev.filter((a) => a._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const startEdit = (item: any) => {
    setEditingId(item._id);
    setEditTitle(item.title);
    setEditDescription(item.description);
  };

  const handleUpdate = async (id: string) => {
    try {
      await putRequest(`/announcements/updateAnnouncement/${id}`, {
        title: editTitle,
        description: editDescription,
      });

      setAnnouncements((prev) =>
        prev.map((a) =>
          a._id === id
            ? {
                ...a,
                title: editTitle,
                description: editDescription,
                updatedAt: new Date().toISOString(),
              }
            : a,
        ),
      );

      setEditingId(null);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <Sidebar />

      <div className="flex flex-1 p-6 gap-6">
        {/* LEFT FORM */}
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-lg bg-white/5 border border-white/10 rounded-2xl p-8 shadow-lg backdrop-blur-md">
            <h1 className="text-2xl font-bold mb-6 text-center text-[#EE2737]">
              Create Announcement
            </h1>

            <label className="block mb-1 text-sm text-gray-300">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter announcement title..."
              className="w-full mb-4 p-3 rounded-lg bg-white/10 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
            />

            <label className="block mb-1 text-sm text-gray-300">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter announcement details..."
              rows={4}
              className="w-full mb-5 p-3 rounded-lg bg-white/10 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
            />

            <button
              onClick={handlePublish}
              className="w-full bg-red-500 hover:bg-red-600 transition py-3 rounded-lg font-semibold"
            >
              🚀 Publish Announcement
            </button>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="w-[400px] h-[90vh] overflow-y-auto bg-white/5 border border-white/10 rounded-2xl p-4 shadow-lg backdrop-blur-md">
          <h2 className="text-xl font-bold mb-4 text-[#EE2737] text-center">
            📢 Announcements
          </h2>

          {loading ? (
            <p className="text-center text-gray-400">Loading...</p>
          ) : announcements.length === 0 ? (
            <p className="text-gray-400 text-center">No announcements found</p>
          ) : (
            announcements.map((item) => (
              <div
                key={item._id}
                className="mb-4 p-4 rounded-xl bg-white/10 hover:bg-white/20 transition"
              >
                {editingId === item._id ? (
                  <>
                    <input
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full mb-2 p-2 rounded bg-black/30"
                    />

                    <textarea
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      className="w-full mb-2 p-2 rounded bg-black/30"
                    />

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleUpdate(item._id)}
                        className="bg-green-500 px-3 py-1 rounded"
                      >
                        Save
                      </button>

                      <button
                        onClick={() => setEditingId(null)}
                        className="bg-gray-500 px-3 py-1 rounded"
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    {/* 🔥 TITLE HEADING */}
                    <p className="text-xs text-gray-400">Title</p>
                    <h3 className="font-semibold text-lg mb-1">{item.title}</h3>

                    {/* 🔥 DESCRIPTION HEADING */}
                    <p className="text-xs text-gray-400 mt-2">Description</p>
                    <p className="text-sm text-gray-300">{item.description}</p>

                    <p className="text-xs mt-2">
                      {item.updatedAt && item.updatedAt !== item.createdAt ? (
                        <span className="text-green-400">
                          ✏️ Edited at {formatPKT(item.updatedAt)}
                        </span>
                      ) : (
                        <span className="text-gray-400">
                          🕒 {formatPKT(item.createdAt)}
                        </span>
                      )}
                    </p>

                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => startEdit(item)}
                        className="bg-green-500 hover:bg-green-600 px-3 py-1 rounded"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(item._id)}
                        className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded"
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))
          )}

          <div className="flex justify-between mt-4">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="bg-gray-700 px-3 py-1 rounded hover:bg-gray-600"
            >
              Prev
            </button>

            <button
              onClick={() => setPage((p) => p + 1)}
              className="bg-gray-700 px-3 py-1 rounded hover:bg-gray-600"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
