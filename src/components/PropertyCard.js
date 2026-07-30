import Link from "next/link";
import Image from "next/image";
import { BedDouble, Bath, Ruler, MapPin, Eye } from "lucide-react";
import { formatPrice, propertyUrl, cldOptimize, POSSESSION_STATUS_META } from "@/lib/utils";

const NEW_WITHIN_DAYS = 14;

export default function PropertyCard({ property }) {
  const img = property.images?.[0];
  const isNew =
    property.createdAt &&
    (Date.now() - new Date(property.createdAt).getTime()) / (1000 * 60 * 60 * 24) <= NEW_WITHIN_DAYS;

  return (
    <Link
      href={propertyUrl(property)}
      className="group block overflow-hidden rounded-xl border border-ink-800/10 bg-white transition-all duration-300 hover:-translate-y-1.5 hover:border-brass-500/30 hover:shadow-xl hover:shadow-ink-900/10"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-ink-900">
        {img ? (
          <Image
            src={cldOptimize(img, 600)}
            alt={property.title}
            fill
            sizes="(max-width: 768px) 100vw, 25vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full items-center justify-center font-mono text-xs text-paper-100/40">No image</div>
        )}

        {/* top-left badges */}
        <div className="absolute left-3 top-3 flex items-center gap-1.5">
          {isNew && (
            <span className="rounded-full bg-paper-50 px-2.5 py-1 font-mono text-[9px] font-semibold uppercase tracking-widest text-ink-900 shadow-sm">
              New
            </span>
          )}
          {property.isVerified && (
            <span className="rounded-full bg-sage-600 px-2.5 py-1 font-mono text-[9px] font-semibold uppercase tracking-widest text-white shadow-sm">
              Verified
            </span>
          )}
        </div>

        {/* views count, top-right */}
        {typeof property.views === "number" && (
          <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-ink-950/60 px-2.5 py-1 font-mono text-[10px] text-paper-50 shadow-sm">
            <Eye size={11} /> {property.views}
          </span>
        )}

        {/* price overlay */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink-950/85 via-ink-950/30 to-transparent px-4 pb-3 pt-8">
          <p className="font-mono text-lg font-semibold tabular-nums text-paper-50">
            {formatPrice(property.price)}
          </p>
        </div>
      </div>

      <div className="p-4">
        <p className="font-mono text-[10px] font-semibold uppercase tracking-widest text-brass-600">
          {property.propertyType}
        </p>
        <h3 className="mt-1 truncate font-display text-lg text-ink-900">{property.title}</h3>
        {property.developerName && (
          <p className="mt-0.5 truncate text-xs text-ink-800/50">By {property.developerName}</p>
        )}
        <p className="mt-1.5 flex items-center gap-1 text-xs text-ink-800/60">
          <MapPin size={12} /> {property.area}, {property.city}
        </p>

        <div className="mt-3 flex items-center border-y border-ink-800/10 py-3 font-mono text-xs text-ink-800/70">
          {property.bhk && (
            <span className="flex items-center gap-1.5">
              <BedDouble size={14} className="text-brass-500" /> {property.bhk} BHK
            </span>
          )}
          {property.bathrooms && (
            <span className="ml-4 flex items-center gap-1.5 border-l border-ink-800/10 pl-4">
              <Bath size={14} className="text-brass-500" /> {property.bathrooms}
            </span>
          )}
          {property.areaSize && (
            <span className="ml-4 flex items-center gap-1.5 border-l border-ink-800/10 pl-4">
              <Ruler size={14} className="text-brass-500" /> {property.areaSize} sqft
            </span>
          )}
        </div>

        {property.possessionStatus && (
          <div className="mt-3">
            <p className="text-xs text-ink-800/70">
              {POSSESSION_STATUS_META[property.possessionStatus]?.label}
              {typeof property.possessionPercent === "number" && ` (${property.possessionPercent}%)`}
            </p>
            <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-ink-800/10">
              <div
                className={`h-full rounded-full ${POSSESSION_STATUS_META[property.possessionStatus]?.barClass}`}
                style={{ width: `${property.possessionPercent || 0}%` }}
              />
            </div>
          </div>
        )}

        <span className="mt-4 flex w-full items-center justify-center rounded-sm bg-ink-900 py-2.5 font-mono text-xs uppercase tracking-widest text-paper-50 transition-colors group-hover:bg-brass-500 group-hover:text-ink-950">
          View Details
        </span>
      </div>
    </Link>
  );
}