"use client";

import { useEffect, useState, useCallback } from "react";
import api from "@/lib/api";
import PropertyCard from "@/components/PropertyCard";
import Spinner from "@/components/Spinner";
import EmptyState from "@/components/EmptyState";
import Button from "@/components/Button";
import Pagination from "@/components/Pagination";
import { Search, SlidersHorizontal, X, Home } from "lucide-react";
import PropertyGridSkeleton from "@/components/skeletons/PropertyGridSkeleton";

const PROPERTY_TYPES = ["flat", "apartment", "villa", "house", "studio", "penthouse", "office", "townhouse", "plot", "commercial"];
const BHK_OPTIONS = ["1", "2", "3", "4", "5+"];
const FURNISHING_OPTIONS = ["furnished", "semi-furnished", "unfurnished"];
const AMENITY_OPTIONS = ["Parking", "Lift", "Security", "Power Backup", "Gym", "Swimming Pool", "Garden", "Clubhouse"];

const emptyFilters = {
  city: "",
  propertyType: [],
  bhk: "",
  furnishing: [],
  minPrice: "",
  maxPrice: "",
  amenities: [],
  sort: "latest",
};

const PAGE_SIZE = 12;

export default function PropertiesPage() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState(emptyFilters);
  const [applied, setApplied] = useState(emptyFilters);
  const [page, setPage] = useState(1);

  const fetchProperties = useCallback(async (f) => {
    setLoading(true);
    try {
      const params = {};
      if (f.city) params.city = f.city;
      if (f.propertyType.length) params.propertyType = f.propertyType.join(",");
      if (f.bhk) params.bhk = f.bhk;
      if (f.furnishing.length) params.furnishing = f.furnishing.join(",");
      if (f.minPrice) params.minPrice = f.minPrice;
      if (f.maxPrice) params.maxPrice = f.maxPrice;
      if (f.amenities.length) params.amenities = f.amenities.join(",");
      if (f.sort) params.sort = f.sort;

      const { data } = await api.get("/property", { params });
      setProperties(data.properties || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setPage(1);
    fetchProperties(applied);
  }, [applied, fetchProperties]);

  function toggleArrayValue(key, value) {
    setFilters((f) => ({
      ...f,
      [key]: f[key].includes(value) ? f[key].filter((v) => v !== value) : [...f[key], value],
    }));
  }

  function applyFilters() {
    setApplied(filters);
    setShowFilters(false);
  }

  function resetFilters() {
    setFilters(emptyFilters);
    setApplied(emptyFilters);
    setShowFilters(false);
  }

  const activeCount =
    (applied.city ? 1 : 0) +
    applied.propertyType.length +
    (applied.bhk ? 1 : 0) +
    applied.furnishing.length +
    (applied.minPrice || applied.maxPrice ? 1 : 0) +
    applied.amenities.length;

  const totalPages = Math.max(1, Math.ceil(properties.length / PAGE_SIZE));
  const paginated = properties.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl italic text-ink-950">Browse properties</h1>
          <p className="mt-1 text-sm text-ink-800/60">{properties.length} results</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-800/40" />
            <input
              placeholder="Search city..."
              value={filters.city}
              onChange={(e) => setFilters({ ...filters, city: e.target.value })}
              onKeyDown={(e) => e.key === "Enter" && applyFilters()}
              className="w-48 rounded-sm border border-ink-800/20 py-2 pl-8 pr-3 text-sm focus:border-brass-500 focus:outline-none"
            />
          </div>

          <select
            value={filters.sort}
            onChange={(e) => setFilters((f) => ({ ...f, sort: e.target.value }))}
            onBlur={applyFilters}
            className="rounded-sm border border-ink-800/20 px-3 py-2 text-xs font-mono uppercase tracking-widest focus:border-brass-500 focus:outline-none"
          >
            <option value="latest">Latest</option>
            <option value="priceLow">Price: Low to High</option>
            <option value="priceHigh">Price: High to Low</option>
          </select>

          <button
            onClick={() => setShowFilters(true)}
            className="flex items-center gap-1.5 rounded-sm border border-ink-800/20 px-3 py-2 text-xs font-mono uppercase tracking-widest hover:border-brass-500"
          >
            <SlidersHorizontal size={14} /> Filters
            {activeCount > 0 && (
              <span className="ml-1 grid h-4 w-4 place-items-center rounded-full bg-brass-500 text-[10px] text-ink-950">
                {activeCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {loading ? (
        <PropertyGridSkeleton count={9} className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3" />
      ) : properties.length === 0 ? (
        <div className="mt-10">
          <EmptyState icon={Home} title="No properties found" description="Try adjusting your filters." />
        </div>
      ) : (
        <>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {paginated.map((p) => (
              <PropertyCard key={p._id} property={p} />
            ))}
          </div>
          <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        </>
      )}

      {showFilters && (
        <div className="fixed inset-0 z-50 flex justify-end bg-ink-950/40">
          <div className="flex h-full w-full max-w-sm flex-col overflow-y-auto bg-paper-50 p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl text-ink-950">Filters</h2>
              <button onClick={() => setShowFilters(false)}>
                <X size={20} className="text-ink-800/60" />
              </button>
            </div>

            <div className="mt-6 space-y-6">
              <div>
                <p className="font-mono text-xs uppercase tracking-widest text-ink-800/70">Property type</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {PROPERTY_TYPES.map((t) => (
                    <button
                      key={t}
                      onClick={() => toggleArrayValue("propertyType", t)}
                      className={`rounded-sm border px-2.5 py-1.5 text-xs capitalize ${
                        filters.propertyType.includes(t)
                          ? "border-brass-500 bg-brass-500/10 text-brass-600"
                          : "border-ink-800/20 text-ink-800/70"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="font-mono text-xs uppercase tracking-widest text-ink-800/70">BHK</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {BHK_OPTIONS.map((b) => (
                    <button
                      key={b}
                      onClick={() => setFilters((f) => ({ ...f, bhk: f.bhk === b ? "" : b }))}
                      className={`rounded-sm border px-3 py-1.5 text-xs ${
                        filters.bhk === b
                          ? "border-brass-500 bg-brass-500/10 text-brass-600"
                          : "border-ink-800/20 text-ink-800/70"
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="font-mono text-xs uppercase tracking-widest text-ink-800/70">Furnishing</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {FURNISHING_OPTIONS.map((f2) => (
                    <button
                      key={f2}
                      onClick={() => toggleArrayValue("furnishing", f2)}
                      className={`rounded-sm border px-2.5 py-1.5 text-xs capitalize ${
                        filters.furnishing.includes(f2)
                          ? "border-brass-500 bg-brass-500/10 text-brass-600"
                          : "border-ink-800/20 text-ink-800/70"
                      }`}
                    >
                      {f2}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="font-mono text-xs uppercase tracking-widest text-ink-800/70">Price range (₹)</p>
                <div className="mt-2 flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.minPrice}
                    onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                    className="w-full rounded-sm border border-ink-800/20 px-3 py-2 text-sm focus:border-brass-500 focus:outline-none"
                  />
                  <span className="text-ink-800/40">–</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.maxPrice}
                    onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                    className="w-full rounded-sm border border-ink-800/20 px-3 py-2 text-sm focus:border-brass-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <p className="font-mono text-xs uppercase tracking-widest text-ink-800/70">Amenities</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {AMENITY_OPTIONS.map((a) => (
                    <button
                      key={a}
                      onClick={() => toggleArrayValue("amenities", a)}
                      className={`rounded-sm border px-2.5 py-1.5 text-xs ${
                        filters.amenities.includes(a)
                          ? "border-brass-500 bg-brass-500/10 text-brass-600"
                          : "border-ink-800/20 text-ink-800/70"
                      }`}
                    >
                      {a}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 flex gap-3">
              <Button variant="outline" onClick={resetFilters} className="flex-1">
                Reset
              </Button>
              <Button onClick={applyFilters} className="flex-1">
                Apply filters
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}