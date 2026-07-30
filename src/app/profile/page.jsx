"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import Button from "@/components/Button";
import Spinner from "@/components/Spinner";
import { User as UserIcon, X } from "lucide-react";
import ProfileSkeleton from "@/components/skeletons/ProfileSkeleton";

export default function ProfilePage() {
  const { user, loading, refreshMe } = useAuth();
  const [form, setForm] = useState({ name: "", phone: "", address: "" });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [removePic, setRemovePic] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Sync form + preview whenever `user` becomes available or changes
  useEffect(() => {
    if (!user) return;
    setForm({
      name: user.name || "",
      phone: user.phone || "",
      address: user.address || "",
    });
    setPreview(user.profilePic || null);
  }, [user]);

  if (loading) return <ProfileSkeleton />;

  if (!user) {
    return <p className="px-6 py-16 text-center text-ink-800/60">Please sign in to view your profile.</p>;
  }

  function handleFileChange(e) {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setRemovePic(false);
  }

  function handleRemovePic() {
    setFile(null);
    setPreview(null);
    setRemovePic(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setMessage("");
    setSaving(true);

    const fd = new FormData();
    fd.append("name", form.name);
    fd.append("phone", form.phone);
    fd.append("address", form.address);
    if (file) fd.append("profilePic", file);
    if (removePic) fd.append("removeProfilePic", "true");

    try {
      const api = (await import("@/lib/api")).default;
      await api.put("/user/profile", fd);
      await refreshMe();
      setMessage("Profile updated");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl italic text-ink-950">My profile</h1>
      <p className="mt-1 text-sm text-ink-800/60 capitalize">{user.role} account</p>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <div className="relative h-20 w-20 overflow-hidden rounded-full bg-ink-900">
            {preview ? (
              <Image src={preview} alt="" fill sizes="80px" className="object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-paper-100/40">
                <UserIcon size={28} />
              </div>
            )}
          </div>
          <div>
            <label className="inline-block cursor-pointer rounded-sm border border-ink-800/20 px-3 py-2 text-xs font-mono uppercase tracking-widest hover:border-brass-500">
              Change photo
              <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            </label>
            {preview && (
              <button
                type="button"
                onClick={handleRemovePic}
                className="ml-2 inline-flex items-center gap-1 text-xs text-rust-500 hover:underline"
              >
                <X size={12} /> Remove
              </button>
            )}
          </div>
        </div>

        <div>
          <label className="font-mono text-xs uppercase tracking-widest text-ink-800/70">Name</label>
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="mt-1.5 w-full rounded-sm border border-ink-800/20 px-3 py-2.5 text-sm focus:border-brass-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="font-mono text-xs uppercase tracking-widest text-ink-800/70">Email</label>
          <input
            disabled
            value={user.email}
            className="mt-1.5 w-full rounded-sm border border-ink-800/10 bg-ink-800/5 px-3 py-2.5 text-sm text-ink-800/50"
          />
        </div>

        <div>
          <label className="font-mono text-xs uppercase tracking-widest text-ink-800/70">Phone</label>
          <input
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="mt-1.5 w-full rounded-sm border border-ink-800/20 px-3 py-2.5 text-sm focus:border-brass-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="font-mono text-xs uppercase tracking-widest text-ink-800/70">Address</label>
          <textarea
            rows={3}
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            className="mt-1.5 w-full rounded-sm border border-ink-800/20 px-3 py-2.5 text-sm focus:border-brass-500 focus:outline-none"
          />
        </div>

        {message && <p className="text-sm text-sage-600">{message}</p>}
        {error && <p className="text-sm text-rust-500">{error}</p>}

        <Button type="submit" disabled={saving} className="self-start">
          {saving ? "Saving..." : "Save changes"}
        </Button>
      </form>
    </div>
  );
}