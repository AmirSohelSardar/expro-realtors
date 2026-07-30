"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import Spinner from "@/components/Spinner";
import Pagination from "@/components/Pagination";
import { useToast } from "@/context/ToastContext";
import { Trash2, Ban, CheckCircle, Search } from "lucide-react";
import TableSkeleton from "@/components/skeletons/TableSkeleton";

const PAGE_SIZE = 10;

export default function AdminUsersPage() {
  const { showToast } = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");

  function fetchUsers() {
    setLoading(true);
    api
      .get("/admin/users")
      .then(({ data }) => setUsers(data.users || []))
      .catch(() => showToast("Failed to load users", "error"))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [query]);

  async function toggleBlock(u) {
    setBusyId(u._id);
    try {
      const { data } = await api.patch(`/admin/users/${u._id}/block`);
      setUsers((prev) => prev.map((x) => (x._id === u._id ? { ...x, isBlocked: data.isBlocked } : x)));
      showToast(data.isBlocked ? "User blocked" : "User unblocked");
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to update user", "error");
    } finally {
      setBusyId(null);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this user permanently?")) return;
    setBusyId(id);
    try {
      await api.delete(`/admin/users/${id}`);
      setUsers((prev) => prev.filter((x) => x._id !== id));
      showToast("User deleted");
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to delete user", "error");
    } finally {
      setBusyId(null);
    }
  }

  if (loading) return <TableSkeleton rows={6} cols={4} />;

  const filtered = users.filter((u) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q);
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl italic text-ink-950">Users</h1>
          <p className="mt-1 text-sm text-ink-800/60">{filtered.length} of {users.length} total</p>
        </div>

        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-800/40" />
          <input
            placeholder="Search name or email..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-64 rounded-sm border border-ink-800/20 py-2 pl-8 pr-3 text-sm focus:border-brass-500 focus:outline-none"
          />
        </div>
      </div>

      <div className="mt-8 overflow-x-auto rounded-sm border border-ink-800/10">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-ink-800/10 bg-paper-100/60 font-mono text-xs uppercase tracking-widest text-ink-800/60">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-800/10">
            {paginated.map((u) => (
              <tr key={u._id}>
                <td className="px-4 py-3">{u.name}</td>
                <td className="px-4 py-3 text-ink-800/60">{u.email}</td>
                <td className="px-4 py-3 capitalize">{u.role}</td>
                <td className="px-4 py-3">
                  {u.isBlocked ? (
                    <span className="rounded-sm bg-rust-500/10 px-2 py-0.5 text-xs text-rust-500">Blocked</span>
                  ) : (
                    <span className="rounded-sm bg-sage-500/10 px-2 py-0.5 text-xs text-sage-600">Active</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleBlock(u)}
                      disabled={busyId === u._id}
                      className="rounded-sm border border-ink-800/20 p-1.5 hover:border-brass-500"
                      title={u.isBlocked ? "Unblock" : "Block"}
                    >
                      {u.isBlocked ? <CheckCircle size={14} /> : <Ban size={14} />}
                    </button>
                    <button
                      onClick={() => handleDelete(u._id)}
                      disabled={busyId === u._id}
                      className="rounded-sm border border-ink-800/20 p-1.5 hover:border-rust-500"
                      title="Delete"
                    >
                      <Trash2 size={14} className="text-rust-500" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {paginated.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-ink-800/50">
                  No users match &ldquo;{query}&rdquo;
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination page={page} totalPages={totalPages} onChange={setPage} />
    </div>
  );
}