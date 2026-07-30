"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import api from "@/lib/api";
import Spinner from "@/components/Spinner";
import Button from "@/components/Button";
import PropertyCard from "@/components/PropertyCard";
import ImageLightbox from "@/components/ImageLightbox";
import SiteVisitForm from "@/components/SiteVisitForm";
import PropertyVideo from "@/components/PropertyVideo";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { formatPrice, POSSESSION_STATUS_META } from "@/lib/utils";
import {
  BedDouble,
  Bath,
  Ruler,
  MapPin,
  Heart,
  Eye,
  MessageCircle,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";

export default function PropertyDetailsPage() {
  const { id: rawParam } = useParams();
  const id = rawParam?.match(/[a-f0-9]{24}$/i)?.[0] || rawParam;
  const router = useRouter();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [property, setProperty] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [inWishlist, setInWishlist] = useState(false);
  const [wishlistBusy, setWishlistBusy] = useState(false);
  const [inquiryMsg, setInquiryMsg] = useState("");
  const [inquirySent, setInquirySent] = useState(false);
  const [inquiryError, setInquiryError] = useState("");
  const [inquiryLoading, setInquiryLoading] = useState(false);

  const fetchProperty = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/property/${id}`);
      setProperty(data.property);
      setSimilar(data.similarProperties || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProperty();
  }, [fetchProperty]);

  useEffect(() => {
    if (!user) return;
    api
      .get("/wishlist")
      .then(({ data }) => {
        const found = data.some((w) => w.property?._id === id);
        setInWishlist(found);
      })
      .catch(() => {});
  }, [user, id]);

  async function toggleWishlist() {
    if (!user) return router.push("/login");
    setWishlistBusy(true);
    try {
      if (inWishlist) {
        await api.delete(`/wishlist/${id}`);
        setInWishlist(false);
        showToast("Removed from wishlist");
      } else {
        await api.post(`/wishlist/${id}`);
        setInWishlist(true);
        showToast("Added to wishlist");
      }
    } catch (err) {
      showToast("Failed to update wishlist", "error");
    } finally {
      setWishlistBusy(false);
    }
  }

  async function handleInquiry(e) {
    e.preventDefault();
    if (!user) return router.push("/login");
    setInquiryError("");
    setInquiryLoading(true);
    try {
      await api.post("/inquiry", { propertyId: id, message: inquiryMsg });
      setInquirySent(true);
      setInquiryMsg("");
    } catch (err) {
      setInquiryError(err.response?.data?.message || "Failed to send inquiry");
    } finally {
      setInquiryLoading(false);
    }
  }

  if (loading) return <Spinner />;
  if (!property) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <p className="text-ink-800/60">Property not found.</p>
        <Link href="/properties" className="mt-3 inline-block text-brass-600 hover:underline">
          Back to listings
        </Link>
      </div>
    );
  }

  const images = property.images?.length ? property.images : [];
  const isOwner = user && property.seller?._id === user._id;
  const isBuyer = user?.role === "buyer";

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-xs text-ink-800/50">
        <Link href="/" className="hover:text-brass-600">Home</Link>
        <ChevronRight size={12} />
        <Link href="/properties" className="hover:text-brass-600">Listings</Link>
        <ChevronRight size={12} />
        <span className="truncate text-ink-800/70">{property.title}</span>
      </div>

     {/* Image gallery grid */}
      <div className={`mt-4 grid grid-cols-1 gap-2 ${images.length > 1 ? "sm:grid-cols-2" : ""}`}>
        <button
          type="button"
          onClick={() => images.length > 0 && setLightboxOpen(true)}
          className={`relative w-full cursor-zoom-in overflow-hidden rounded-sm bg-ink-900 ${
            images.length > 1
              ? "aspect-[4/3] sm:row-span-2 sm:aspect-auto lg:h-[420px]"
              : "aspect-[16/9] max-h-[500px] lg:h-[420px]"
          }`}
        >
          {images.length > 0 ? (
            <Image src={images[activeImg]} alt={property.title} fill sizes="(max-width: 640px) 100vw, 50vw" className="object-cover" priority />
          ) : (
            <div className="flex h-full items-center justify-center font-mono text-xs text-paper-100/40">No image</div>
          )}
        </button>
        {images.slice(1, 3).map((img, i) => (
          <button
            key={img}
            onClick={() => {
              setActiveImg(i + 1);
              setLightboxOpen(true);
            }}
            className="relative aspect-[16/9] w-full cursor-zoom-in overflow-hidden rounded-sm bg-ink-900 lg:h-[206px]"
          >
            <Image src={img} alt="" fill sizes="50vw" className="object-cover" />
          </button>
        ))}
      </div>
      {images.length > 3 && (
        <div className="mt-2 flex gap-2 overflow-x-auto">
          {images.map((img, i) => (
            <button
              key={img}
              onClick={() => {
                setActiveImg(i);
                setLightboxOpen(true);
              }}
              className={`relative h-16 w-20 shrink-0 overflow-hidden rounded-sm border-2 ${
                activeImg === i ? "border-brass-500" : "border-transparent"
              }`}
            >
              <Image src={img} alt="" fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      )}

      {lightboxOpen && images.length > 0 && (
        <ImageLightbox images={images} initialIndex={activeImg} onClose={() => setLightboxOpen(false)} />
      )}

      <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-3">
        {/* Left column */}
        <div className="lg:col-span-2">
          {property.isVerified && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-sage-500/30 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-sage-600">
              <ShieldCheck size={12} /> Verified Listing
            </span>
          )}

          <div className="mt-3 flex items-start justify-between gap-4">
            <div>
              {property.developerName && (
                <p className="text-sm text-ink-800/50">By {property.developerName}</p>
              )}
              <h1 className="font-display text-3xl italic text-ink-950">{property.title}</h1>
              <p className="mt-1 flex items-center gap-1 text-sm text-ink-800/60">
                <MapPin size={14} /> {property.area}, {property.city}, {property.pincode}
              </p>
            </div>
            <button
              onClick={toggleWishlist}
              disabled={wishlistBusy}
              className="shrink-0 rounded-full border border-ink-800/20 p-2.5 hover:border-rust-500"
              aria-label="Toggle wishlist"
            >
              <Heart size={18} className={inWishlist ? "fill-rust-500 text-rust-500" : "text-ink-800/60"} />
            </button>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-5">
            <div className="rounded-sm bg-paper-100/60 p-3 text-center">
              <BedDouble size={16} className="mx-auto text-ink-800/40" />
              <p className="mt-1 font-mono text-sm font-semibold text-ink-950">{property.bhk || "—"}</p>
              <p className="font-mono text-[9px] uppercase tracking-widest text-ink-800/50">Bedrooms</p>
            </div>
            <div className="rounded-sm bg-paper-100/60 p-3 text-center">
              <Bath size={16} className="mx-auto text-ink-800/40" />
              <p className="mt-1 font-mono text-sm font-semibold text-ink-950">{property.bathrooms || "—"}</p>
              <p className="font-mono text-[9px] uppercase tracking-widest text-ink-800/50">Bathrooms</p>
            </div>
            <div className="rounded-sm bg-paper-100/60 p-3 text-center">
              <p className="font-mono text-sm font-semibold capitalize text-ink-950">{property.furnishing || "—"}</p>
              <p className="mt-1 font-mono text-[9px] uppercase tracking-widest text-ink-800/50">Furnishing</p>
            </div>
            <div className="rounded-sm bg-paper-100/60 p-3 text-center">
              <Ruler size={16} className="mx-auto text-ink-800/40" />
              <p className="mt-1 font-mono text-sm font-semibold text-ink-950">{property.areaSize || "—"}</p>
              <p className="font-mono text-[9px] uppercase tracking-widest text-ink-800/50">Sqft</p>
            </div>
            <div className="rounded-sm bg-paper-100/60 p-3 text-center">
              <p className="font-mono text-sm font-semibold capitalize text-ink-950">{property.propertyType}</p>
              <p className="mt-1 font-mono text-[9px] uppercase tracking-widest text-ink-800/50">Type</p>
            </div>
          </div>

          {(property.possessionStatus || property.blocks || property.totalUnits || property.reraId) && (
            <div className="mt-8 rounded-sm border border-ink-800/10 p-5">
              <div className="grid grid-cols-2 gap-y-4 text-sm sm:grid-cols-4">
                {property.blocks && (
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-widest text-ink-800/40">Blocks</p>
                    <p className="mt-1 text-ink-900">{property.blocks}</p>
                  </div>
                )}
                {property.totalUnits && (
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-widest text-ink-800/40">Units</p>
                    <p className="mt-1 text-ink-900">{property.totalUnits}</p>
                  </div>
                )}
                {property.possessionYear && (
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-widest text-ink-800/40">Possession</p>
                    <p className="mt-1 text-ink-900">{property.possessionYear}</p>
                  </div>
                )}
                {property.reraId && (
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-widest text-ink-800/40">RERA ID</p>
                    <p className="mt-1 break-all text-ink-900">{property.reraId}</p>
                  </div>
                )}
              </div>

              {property.possessionStatus && (
                <div className="mt-4 border-t border-ink-800/10 pt-4">
                  <p className="font-mono text-xs uppercase tracking-widest text-rust-500">
                    {POSSESSION_STATUS_META[property.possessionStatus]?.label}
                    {typeof property.possessionPercent === "number" && ` (${property.possessionPercent}%)`}
                  </p>
                  <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-ink-800/10">
                    <div
                      className={`h-full rounded-full ${POSSESSION_STATUS_META[property.possessionStatus]?.barClass}`}
                      style={{ width: `${property.possessionPercent || 0}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="mt-8">
            <h2 className="font-display text-xl text-ink-950">Description</h2>
            <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-ink-800/80">{property.description}</p>
          </div>

          {property.youtubeUrl && <PropertyVideo youtubeUrl={property.youtubeUrl} />}

          {(property.investmentAnalysis || property.whyConsider) && (
            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {property.investmentAnalysis && (
                <div className="rounded-sm border border-ink-800/10 p-5">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-rust-500">
                    Expert Analysis. Smarter Investments.
                  </p>
                  <h2 className="mt-1 font-display text-lg text-ink-950">Expro Investment Analysis</h2>
                  <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-ink-800/80">
                    {property.investmentAnalysis}
                  </p>
                </div>
              )}
              {property.whyConsider && (
                <div className="rounded-sm border border-ink-800/10 p-5">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-rust-500">
                    What Makes This Project a Smart Choice.
                  </p>
                  <h2 className="mt-1 font-display text-lg text-ink-950">Why Consider This Project?</h2>
                  <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-ink-800/80">
                    {property.whyConsider}
                  </p>
                </div>
              )}
            </div>
          )}

          {property.ceoCommentary && (
            <div className="mt-10 rounded-sm bg-paper-100/60 p-5 sm:p-6">
              <h2 className="font-display text-xl text-ink-950">Expert Perspective</h2>

              <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start">
                <div className="relative mx-auto h-20 w-20 shrink-0 overflow-hidden rounded-full border-2 border-brass-500 shadow-sm sm:mx-0">
                  <Image
                    src="/ceo.jpg"
                    alt="Habibur Rahaman — CEO, Expro Group"
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </div>

                <div className="flex-1 text-center sm:text-left">
                  <p className="font-display text-base text-ink-950">Habibur Rahaman</p>
                  <p className="font-mono text-xs uppercase tracking-widest text-brass-600">CEO, Expro Group</p>

                  <div className="relative mt-3 rounded-sm bg-paper-50 p-4 shadow-sm">
                    <span className="absolute left-2 top-0 font-display text-4xl leading-none text-brass-500/30">&ldquo;</span>
                    <p className="whitespace-pre-line text-sm italic leading-relaxed text-ink-800/80">
                      {property.ceoCommentary}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {(property.strengths || property.considerations) && (
            <div className="mt-6">
              <p className="font-mono text-[10px] uppercase tracking-widest text-rust-500">Honest Insights</p>
              <h2 className="mt-1 font-display text-xl text-ink-950">Pros &amp; Considerations</h2>
              <div className="mt-3 grid gap-4 sm:grid-cols-2">
                {property.strengths && (
                  <div className="rounded-sm bg-sage-500/5 p-5">
                    <p className="font-mono text-xs font-semibold uppercase tracking-widest text-sage-600">Strengths</p>
                    <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-ink-800/80">
                      {property.strengths}
                    </p>
                  </div>
                )}
                {property.considerations && (
                  <div className="rounded-sm bg-brass-500/5 p-5">
                    <p className="font-mono text-xs font-semibold uppercase tracking-widest text-brass-600">Things to Consider</p>
                    <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-ink-800/80">
                      {property.considerations}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {property.amenities?.length > 0 && (
            <div className="mt-8">
              <h2 className="font-display text-xl text-ink-950">Amenities</h2>
              <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {property.amenities.map((a) => (
                  <span key={a} className="flex items-center gap-1.5 text-sm text-ink-800/70">
                    <ShieldCheck size={14} className="text-sage-500" /> {a}
                  </span>
                ))}
              </div>
            </div>
          )}

          {(property.locationImage || property.locationDetails) && (
            <div className="mt-10">
              <h2 className="font-display text-xl text-ink-950">Location</h2>
              <div className="mt-3 grid gap-4 sm:grid-cols-2">
                {property.locationDetails && (
                  <div className="rounded-sm border border-ink-800/10 p-5">
                    <p className="whitespace-pre-line text-sm leading-relaxed text-ink-800/80">
                      {property.locationDetails}
                    </p>
                  </div>
                )}
                {property.locationImage && (
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-sm border border-ink-800/10 bg-ink-900">
                    <Image
                      src={property.locationImage}
                      alt={`${property.title} location map`}
                      fill
                      sizes="(max-width: 640px) 100vw, 50vw"
                      className="object-cover"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="mt-10 rounded-sm border border-ink-800/10 p-5">
            <h2 className="font-display text-lg text-ink-950">Property Details</h2>
            <div className="mt-4 grid grid-cols-2 gap-y-4 text-sm">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-ink-800/40">Property ID</p>
                <p className="mt-1 font-mono text-ink-900">{property._id.slice(-8).toUpperCase()}</p>
              </div>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-ink-800/40">Added On</p>
                <p className="mt-1 text-ink-900">{new Date(property.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-ink-800/40">Property Type</p>
                <p className="mt-1 capitalize text-ink-900">{property.propertyType}</p>
              </div>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-ink-800/40">Status</p>
                <p className="mt-1 capitalize text-ink-900">{property.status === "sale" ? "For Sale" : "Sold"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 flex flex-col gap-4">
            <div className="rounded-sm bg-ink-900 p-5">
              <p className="font-mono text-[10px] uppercase tracking-widest text-brass-400">Listing Price</p>
              <p className="mt-1 font-mono text-2xl font-semibold tabular-nums text-paper-50">{formatPrice(property.price)}</p>
              <p className="mt-1 text-xs text-paper-100/50">{property.status === "sale" ? "Available for Sale" : "Sold"}</p>
            </div>

            <div className="rounded-sm border border-ink-800/10 p-5">
              <div className="flex items-center gap-3">
                <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full bg-ink-900">
                  {property.seller?.profilePic && (
                    <Image src={property.seller.profilePic} alt="" fill sizes="44px" className="object-cover" />
                  )}
                </div>
                <div>
                  <Link
                    href={`/sellers/${property.seller?._id}`}
                    className="font-display text-base text-ink-950 hover:text-brass-600 hover:underline"
                  >
                    {property.seller?.name}
                  </Link>
                  {property.seller?.role === "admin" ? (
                    <p className="flex items-center gap-1 text-xs text-brass-600">
                      <ShieldCheck size={11} /> Expro Realtors Team
                    </p>
                  ) : (
                    property.seller?.isApproved && (
                      <p className="flex items-center gap-1 text-xs text-sage-600">
                        <ShieldCheck size={11} /> Verified Seller
                      </p>
                    )
                  )}
                </div>
              </div>

              {isOwner ? (
                <p className="mt-4 text-xs text-ink-800/50">This is your own listing.</p>
              ) : (
                <>
                  {!user ? (
                    <Link
                      href="/login"
                      className="mt-4 flex w-full items-center justify-center gap-2 rounded-sm bg-ink-900 px-4 py-2.5 font-mono text-xs uppercase tracking-widest text-paper-50 hover:bg-ink-800"
                    >
                      <MessageCircle size={14} /> Login to chat
                    </Link>
                  ) : isBuyer ? (
                    <Link
                      href={`/chat?sellerId=${property.seller?._id}&propertyId=${property._id}`}
                      className="mt-4 flex w-full items-center justify-center gap-2 rounded-sm bg-ink-900 px-4 py-2.5 font-mono text-xs uppercase tracking-widest text-paper-50 hover:bg-ink-800"
                    >
                      <MessageCircle size={14} /> Chat
                    </Link>
                  ) : (
                    <p className="mt-4 rounded-sm bg-paper-100/60 p-3 text-center text-xs text-ink-800/60">
                      Only buyer accounts can chat with the lister.
                    </p>
                  )}

                  {isBuyer && <SiteVisitForm propertyId={property._id} />}

                  <div className="mt-4 border-t border-ink-800/10 pt-4">
                    <p className="font-mono text-xs uppercase tracking-widest text-ink-800/50">Inquire</p>

                    {!user ? (
                      <div className="mt-2 rounded-sm bg-paper-100/60 p-3 text-center">
                        <p className="text-xs text-ink-800/60">Please login as a buyer to send inquiries.</p>
                        <Link
                          href="/login"
                          className="mt-2 inline-block w-full rounded-sm bg-brass-500 px-4 py-2.5 font-mono text-xs uppercase tracking-widest text-ink-950 hover:bg-brass-400"
                        >
                          Login
                        </Link>
                      </div>
                    ) : !isBuyer ? (
                      <div className="mt-2 rounded-sm bg-paper-100/60 p-3 text-center">
                        <p className="text-xs text-ink-800/60">Only buyer accounts can send inquiries.</p>
                      </div>
                    ) : inquirySent ? (
                      <p className="mt-2 text-sm text-sage-600">Inquiry sent — the seller will get back to you.</p>
                    ) : (
                      <form onSubmit={handleInquiry}>
                        <textarea
                          required
                          rows={3}
                          placeholder="I'm interested in this property..."
                          value={inquiryMsg}
                          onChange={(e) => setInquiryMsg(e.target.value)}
                          className="mt-2 w-full rounded-sm border border-ink-800/20 px-3 py-2 text-sm focus:border-brass-500 focus:outline-none"
                        />
                        {inquiryError && <p className="mt-1 text-xs text-rust-500">{inquiryError}</p>}
                        <Button type="submit" disabled={inquiryLoading} className="mt-3 w-full">
                          {inquiryLoading ? "Sending..." : "Send inquiry"}
                        </Button>
                      </form>
                    )}
                  </div>
                </>
              )}

              <div className="mt-4 flex items-center gap-1.5 border-t border-ink-800/10 pt-4 text-xs text-ink-800/40">
                <Eye size={12} /> {property.views} people viewed this listing
              </div>
            </div>
          </div>
        </div>
      </div>

      {similar.length > 0 && (
        <div className="mt-16">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-2xl text-ink-950">Similar Properties</h2>
              <p className="text-sm text-ink-800/50">Listings you might like in {property.city}.</p>
            </div>
            <Link href="/properties" className="flex items-center gap-1 text-sm text-brass-600 hover:underline">
              All Listings <ChevronRight size={14} />
            </Link>
          </div>
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {similar.map((p) => (
              <PropertyCard key={p._id} property={p} />
            ))}
          </div>
        </div>
      )}
      {similar.length === 0 && (
        <div className="mt-16">
          <h2 className="font-display text-2xl text-ink-950">Similar Properties</h2>
          <p className="text-sm text-ink-800/50">Listings you might like in {property.city}.</p>
          <div className="mt-6 rounded-sm bg-paper-100/60 p-8 text-center text-sm text-ink-800/50">
            No similar properties found in this location.
          </div>
        </div>
      )}
    </div>
  );
}