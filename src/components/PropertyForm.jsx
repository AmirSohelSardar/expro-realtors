"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import api from "@/lib/api";
import Button from "@/components/Button";
import { X, ShieldCheck, Clock } from "lucide-react";

const PROPERTY_TYPES = ["flat", "apartment", "villa", "house", "studio", "penthouse", "office", "townhouse", "plot", "commercial"];
const FURNISHING_OPTIONS = ["furnished", "semi-furnished", "unfurnished"];
const AMENITY_OPTIONS = ["Parking", "Lift", "Security", "Power Backup", "Gym", "Swimming Pool", "Garden", "Clubhouse"];

export default function PropertyForm({ initialData, propertyId }) {
  const router = useRouter();
  const isEdit = Boolean(propertyId);

  const [form, setForm] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    price: initialData?.price || "",
    city: initialData?.city || "",
    area: initialData?.area || "",
    pincode: initialData?.pincode || "",
    propertyType: initialData?.propertyType || "",
    bhk: initialData?.bhk || "",
    bathrooms: initialData?.bathrooms || "",
    areaSize: initialData?.areaSize || "",
    furnishing: initialData?.furnishing || "",
    status: initialData?.status || "sale",
    amenities: initialData?.amenities || [],
    youtubeUrl: initialData?.youtubeUrl || "",
    developerName: initialData?.developerName || "",
    possessionStatus: initialData?.possessionStatus || "",
    possessionPercent: initialData?.possessionPercent ?? "",
    blocks: initialData?.blocks || "",
    totalUnits: initialData?.totalUnits || "",
    possessionYear: initialData?.possessionYear || "",
    reraId: initialData?.reraId || "",
  });
  const [existingImages, setExistingImages] = useState(initialData?.images || []);
  const [newFiles, setNewFiles] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function toggleAmenity(a) {
    setForm((f) => ({
      ...f,
      amenities: f.amenities.includes(a) ? f.amenities.filter((x) => x !== a) : [...f.amenities, a],
    }));
  }

  function handleFileChange(e) {
    setNewFiles((prev) => [...prev, ...Array.from(e.target.files)]);
  }

  function removeExistingImage(url) {
    setExistingImages((prev) => prev.filter((i) => i !== url));
  }

  function removeNewFile(idx) {
    setNewFiles((prev) => prev.filter((_, i) => i !== idx));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const fd = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (key === "amenities") fd.append("amenities", JSON.stringify(value));
      else fd.append(key, value);
    });
    if (isEdit) fd.append("existingImages", JSON.stringify(existingImages));
    newFiles.forEach((file) => fd.append("images", file));

    try {
      if (isEdit) {
        await api.put(`/property/${propertyId}`, fd);
      } else {
        await api.post("/property", fd);
      }
      router.push("/dashboard/seller/properties");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save property");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-6">
      {!isEdit && (
        <div className="flex items-start gap-3 rounded-sm border border-brass-500/30 bg-brass-500/5 p-4">
          <Clock size={18} className="mt-0.5 shrink-0 text-brass-600" />
          <div>
            <p className="text-sm font-medium text-ink-950">Your listing will be reviewed before it goes live</p>
            <p className="mt-1 text-xs text-ink-800/60">
              New properties are checked by our admin team before they appear to buyers. This usually
              takes a short while — you can track the status anytime from{" "}
              <span className="font-medium text-brass-600">My Properties</span>.
            </p>
          </div>
        </div>
      )}

      {isEdit && initialData?.isVerified && (
        <div className="flex items-start gap-3 rounded-sm border border-sage-500/30 bg-sage-500/5 p-4">
          <ShieldCheck size={18} className="mt-0.5 shrink-0 text-sage-600" />
          <div>
            <p className="text-sm font-medium text-ink-950">This listing is verified and live</p>
            <p className="mt-1 text-xs text-ink-800/60">
              Changes you save here will update immediately without needing re-approval.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="font-mono text-xs uppercase tracking-widest text-ink-800/70">Title</label>
          <input
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="mt-1.5 w-full rounded-sm border border-ink-800/20 px-3 py-2.5 text-sm focus:border-brass-500 focus:outline-none"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="font-mono text-xs uppercase tracking-widest text-ink-800/70">Description</label>
          <textarea
            required
            rows={4}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="mt-1.5 w-full rounded-sm border border-ink-800/20 px-3 py-2.5 text-sm focus:border-brass-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="font-mono text-xs uppercase tracking-widest text-ink-800/70">Price (₹)</label>
          <input
            type="number"
            required
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            className="mt-1.5 w-full rounded-sm border border-ink-800/20 px-3 py-2.5 text-sm focus:border-brass-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="font-mono text-xs uppercase tracking-widest text-ink-800/70">Property type</label>
          <select
            required
            value={form.propertyType}
            onChange={(e) => setForm({ ...form, propertyType: e.target.value })}
            className="mt-1.5 w-full rounded-sm border border-ink-800/20 px-3 py-2.5 text-sm capitalize focus:border-brass-500 focus:outline-none"
          >
            <option value="">Select type</option>
            {PROPERTY_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="font-mono text-xs uppercase tracking-widest text-ink-800/70">City</label>
          <input
            required
            value={form.city}
            onChange={(e) => setForm({ ...form, city: e.target.value })}
            className="mt-1.5 w-full rounded-sm border border-ink-800/20 px-3 py-2.5 text-sm focus:border-brass-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="font-mono text-xs uppercase tracking-widest text-ink-800/70">Area / Locality</label>
          <input
            required
            value={form.area}
            onChange={(e) => setForm({ ...form, area: e.target.value })}
            className="mt-1.5 w-full rounded-sm border border-ink-800/20 px-3 py-2.5 text-sm focus:border-brass-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="font-mono text-xs uppercase tracking-widest text-ink-800/70">Pincode</label>
          <input
            required
            value={form.pincode}
            onChange={(e) => setForm({ ...form, pincode: e.target.value })}
            className="mt-1.5 w-full rounded-sm border border-ink-800/20 px-3 py-2.5 text-sm focus:border-brass-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="font-mono text-xs uppercase tracking-widest text-ink-800/70">BHK</label>
          <input
            value={form.bhk}
            onChange={(e) => setForm({ ...form, bhk: e.target.value })}
            placeholder="e.g. 2"
            className="mt-1.5 w-full rounded-sm border border-ink-800/20 px-3 py-2.5 text-sm focus:border-brass-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="font-mono text-xs uppercase tracking-widest text-ink-800/70">Bathrooms</label>
          <input
            type="number"
            value={form.bathrooms}
            onChange={(e) => setForm({ ...form, bathrooms: e.target.value })}
            className="mt-1.5 w-full rounded-sm border border-ink-800/20 px-3 py-2.5 text-sm focus:border-brass-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="font-mono text-xs uppercase tracking-widest text-ink-800/70">Area size (sqft)</label>
          <input
            type="number"
            value={form.areaSize}
            onChange={(e) => setForm({ ...form, areaSize: e.target.value })}
            className="mt-1.5 w-full rounded-sm border border-ink-800/20 px-3 py-2.5 text-sm focus:border-brass-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="font-mono text-xs uppercase tracking-widest text-ink-800/70">Furnishing</label>
          <select
            value={form.furnishing}
            onChange={(e) => setForm({ ...form, furnishing: e.target.value })}
            className="mt-1.5 w-full rounded-sm border border-ink-800/20 px-3 py-2.5 text-sm capitalize focus:border-brass-500 focus:outline-none"
          >
            <option value="">Select</option>
            {FURNISHING_OPTIONS.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
        </div>

        {isEdit && (
          <div>
            <label className="font-mono text-xs uppercase tracking-widest text-ink-800/70">Status</label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="mt-1.5 w-full rounded-sm border border-ink-800/20 px-3 py-2.5 text-sm capitalize focus:border-brass-500 focus:outline-none"
            >
              <option value="sale">Sale</option>
              <option value="sold">Sold</option>
            </select>
          </div>
        )}
      </div>

      <div className="rounded-sm border border-ink-800/10 p-4">
        <p className="font-mono text-xs uppercase tracking-widest text-ink-800/70">
          Developer &amp; possession details <span className="normal-case text-ink-800/40">(optional — for new project listings)</span>
        </p>

        <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="font-mono text-xs uppercase tracking-widest text-ink-800/70">Developer name</label>
            <input
              value={form.developerName}
              onChange={(e) => setForm({ ...form, developerName: e.target.value })}
              placeholder="e.g. Vinayak Group"
              className="mt-1.5 w-full rounded-sm border border-ink-800/20 px-3 py-2.5 text-sm focus:border-brass-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="font-mono text-xs uppercase tracking-widest text-ink-800/70">Possession status</label>
            <select
              value={form.possessionStatus}
              onChange={(e) => setForm({ ...form, possessionStatus: e.target.value })}
              className="mt-1.5 w-full rounded-sm border border-ink-800/20 px-3 py-2.5 text-sm focus:border-brass-500 focus:outline-none"
            >
              <option value="">Not applicable</option>
              <option value="new-launch">New Launch</option>
              <option value="under-construction">Under Construction</option>
              <option value="ready-to-move">Ready to Move</option>
            </select>
          </div>

          <div>
            <label className="font-mono text-xs uppercase tracking-widest text-ink-800/70">Completion (%)</label>
            <input
              type="number"
              min="0"
              max="100"
              value={form.possessionPercent}
              onChange={(e) => setForm({ ...form, possessionPercent: e.target.value })}
              className="mt-1.5 w-full rounded-sm border border-ink-800/20 px-3 py-2.5 text-sm focus:border-brass-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="font-mono text-xs uppercase tracking-widest text-ink-800/70">Possession year</label>
            <input
              value={form.possessionYear}
              onChange={(e) => setForm({ ...form, possessionYear: e.target.value })}
              placeholder="e.g. 2032"
              className="mt-1.5 w-full rounded-sm border border-ink-800/20 px-3 py-2.5 text-sm focus:border-brass-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="font-mono text-xs uppercase tracking-widest text-ink-800/70">Blocks</label>
            <input
              value={form.blocks}
              onChange={(e) => setForm({ ...form, blocks: e.target.value })}
              placeholder="e.g. 5 | G + 21"
              className="mt-1.5 w-full rounded-sm border border-ink-800/20 px-3 py-2.5 text-sm focus:border-brass-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="font-mono text-xs uppercase tracking-widest text-ink-800/70">Total units</label>
            <input
              type="number"
              value={form.totalUnits}
              onChange={(e) => setForm({ ...form, totalUnits: e.target.value })}
              placeholder="e.g. 750"
              className="mt-1.5 w-full rounded-sm border border-ink-800/20 px-3 py-2.5 text-sm focus:border-brass-500 focus:outline-none"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="font-mono text-xs uppercase tracking-widest text-ink-800/70">RERA ID</label>
            <input
              value={form.reraId}
              onChange={(e) => setForm({ ...form, reraId: e.target.value })}
              placeholder="e.g. WBRERA/P/SOU/2026/004147"
              className="mt-1.5 w-full rounded-sm border border-ink-800/20 px-3 py-2.5 text-sm focus:border-brass-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      <div>
        <label className="font-mono text-xs uppercase tracking-widest text-ink-800/70">
          YouTube video link <span className="normal-case text-ink-800/40">(optional)</span>
        </label>
        <input
          type="url"
          value={form.youtubeUrl}
          onChange={(e) => setForm({ ...form, youtubeUrl: e.target.value })}
          placeholder="https://www.youtube.com/watch?v=..."
          className="mt-1.5 w-full rounded-sm border border-ink-800/20 px-3 py-2.5 text-sm focus:border-brass-500 focus:outline-none"
        />
        <p className="mt-1 text-xs text-ink-800/50">Paste a YouTube link for a walkthrough or tour video — leave blank if you don't have one.</p>
      </div>

      <div>
        <label className="font-mono text-xs uppercase tracking-widest text-ink-800/70">Amenities</label>
        <div className="mt-2 flex flex-wrap gap-2">
          {AMENITY_OPTIONS.map((a) => (
            <button
              type="button"
              key={a}
              onClick={() => toggleAmenity(a)}
              className={`rounded-sm border px-2.5 py-1.5 text-xs ${
                form.amenities.includes(a) ? "border-brass-500 bg-brass-500/10 text-brass-600" : "border-ink-800/20 text-ink-800/70"
              }`}
            >
              {a}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="font-mono text-xs uppercase tracking-widest text-ink-800/70">Images</label>

        {(existingImages.length > 0 || newFiles.length > 0) && (
          <div className="mt-2 flex flex-wrap gap-3">
            {existingImages.map((url) => (
              <div key={url} className="relative h-20 w-24 overflow-hidden rounded-sm border border-ink-800/10">
                <Image src={url} alt="" fill sizes="96px" className="object-cover" />
                <button
                  type="button"
                  onClick={() => removeExistingImage(url)}
                  className="absolute right-1 top-1 rounded-full bg-ink-950/70 p-0.5 text-paper-50"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
            {newFiles.map((file, i) => (
              <div key={i} className="relative h-20 w-24 overflow-hidden rounded-sm border border-ink-800/10">
                <img src={URL.createObjectURL(file)} alt="" className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeNewFile(i)}
                  className="absolute right-1 top-1 rounded-full bg-ink-950/70 p-0.5 text-paper-50"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        )}

        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="mt-3 w-full text-sm file:mr-3 file:rounded-sm file:border-0 file:bg-ink-900 file:px-3 file:py-2 file:text-xs file:uppercase file:tracking-widest file:text-paper-50"
        />
        <p className="mt-1 text-xs text-ink-800/50">Up to 10 images total.</p>
      </div>

      {error && <p className="text-sm text-rust-500">{error}</p>}

      <Button type="submit" disabled={loading} className="self-start">
        {loading ? "Saving..." : isEdit ? "Save changes" : "Submit for review"}
      </Button>
    </form>
  );
}