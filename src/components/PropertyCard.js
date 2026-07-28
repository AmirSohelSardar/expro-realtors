import Link from "next/link";
import Image from "next/image";
import { BedDouble, Bath, Ruler, MapPin } from "lucide-react";
import { formatPrice, propertyUrl, cldOptimize } from "@/lib/utils";

export default function PropertyCard({ property }) {
  const img = property.images?.[0];
  return (
    <Link href={propertyUrl(property)} className="group block overflow-hidden rounded-sm border border-ink-800/10 bg-white transition-all duration-300 hover:-translate-y-1.5 hover:border-brass-500/30 hover:shadow-xl hover:shadow-ink-900/10">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-ink-900">
        {img ? (
          <Image src={cldOptimize(img, 600)} alt={property.title} fill sizes="(max-width: 768px) 100vw, 25vw" className="object-cover transition-transform duration-700 ease-out group-hover:scale-110" />
        ) : (
          <div className="flex h-full items-center justify-center font-mono text-xs text-paper-100/40">No image</div>
        )}
      </div>
      <div className="p-4">
        <p className="font-mono text-lg font-medium tabular-nums text-ink-950">{formatPrice(property.price)}</p>
        <h3 className="mt-1 truncate font-display text-lg text-ink-900">{property.title}</h3>
        <p className="mt-1 flex items-center gap-1 text-xs text-ink-800/60">
          <MapPin size={12} /> {property.area}, {property.city}
        </p>
        <div className="mt-3 flex items-center gap-4 border-t border-ink-800/10 pt-3 font-mono text-xs text-ink-800/70">
          {property.bhk && <span className="flex items-center gap-1"><BedDouble size={14} /> {property.bhk} BHK</span>}
          {property.bathrooms && <span className="flex items-center gap-1"><Bath size={14} /> {property.bathrooms}</span>}
          {property.areaSize && <span className="flex items-center gap-1"><Ruler size={14} /> {property.areaSize} sqft</span>}
        </div>
      </div>
    </Link>
  );
}