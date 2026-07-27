// "use client";

// import { useEffect, useState, useCallback } from "react";
// import { useParams, useRouter } from "next/navigation";
// import Image from "next/image";
// import Link from "next/link";
// import api from "@/lib/api";
// import Spinner from "@/components/Spinner";
// import Button from "@/components/Button";
// import PropertyCard from "@/components/PropertyCard";
// import { useAuth } from "@/context/AuthContext";
// import { useToast } from "@/context/ToastContext";
// import { formatPrice } from "@/lib/utils";
// import { BedDouble, Bath, Ruler, MapPin, Heart, Eye, MessageCircle } from "lucide-react";

// export default function PropertyDetailsPage() {
//   const { id } = useParams();
//   const router = useRouter();
//   const { user } = useAuth();
//   const { showToast } = useToast();

//   const [property, setProperty] = useState(null);
//   const [similar, setSimilar] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [activeImg, setActiveImg] = useState(0);
//   const [inWishlist, setInWishlist] = useState(false);
//   const [wishlistBusy, setWishlistBusy] = useState(false);
//   const [inquiryMsg, setInquiryMsg] = useState("");
//   const [inquirySent, setInquirySent] = useState(false);
//   const [inquiryError, setInquiryError] = useState("");
//   const [inquiryLoading, setInquiryLoading] = useState(false);

//   const fetchProperty = useCallback(async () => {
//     setLoading(true);
//     try {
//       const { data } = await api.get(`/property/${id}`);
//       setProperty(data.property);
//       setSimilar(data.similarProperties || []);
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   }, [id]);

//   useEffect(() => {
//     fetchProperty();
//   }, [fetchProperty]);

//   useEffect(() => {
//     if (!user) return;
//     api
//       .get("/wishlist")
//       .then(({ data }) => {
//         const found = data.some((w) => w.property?._id === id);
//         setInWishlist(found);
//       })
//       .catch(() => {});
//   }, [user, id]);

//   async function toggleWishlist() {
//     if (!user) return router.push("/login");
//     setWishlistBusy(true);
//     try {
//       if (inWishlist) {
//         await api.delete(`/wishlist/${id}`);
//         setInWishlist(false);
//         showToast("Removed from wishlist");
//       } else {
//         await api.post(`/wishlist/${id}`);
//         setInWishlist(true);
//         showToast("Added to wishlist");
//       }
//     } catch (err) {
//       showToast("Failed to update wishlist", "error");
//     } finally {
//       setWishlistBusy(false);
//     }
//   }

//   async function handleInquiry(e) {
//     e.preventDefault();
//     if (!user) return router.push("/login");
//     setInquiryError("");
//     setInquiryLoading(true);
//     try {
//       await api.post("/inquiry", { propertyId: id, message: inquiryMsg });
//       setInquirySent(true);
//       setInquiryMsg("");
//     } catch (err) {
//       setInquiryError(err.response?.data?.message || "Failed to send inquiry");
//     } finally {
//       setInquiryLoading(false);
//     }
//   }

//   if (loading) return <Spinner />;
//   if (!property) {
//     return (
//       <div className="mx-auto max-w-3xl px-4 py-20 text-center">
//         <p className="text-ink-800/60">Property not found.</p>
//         <Link href="/properties" className="mt-3 inline-block text-brass-600 hover:underline">
//           Back to listings
//         </Link>
//       </div>
//     );
//   }

//   const images = property.images?.length ? property.images : [];
//   const isOwner = user && property.seller?._id === user._id;

//   return (
//     <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
//       <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
//         <div className="lg:col-span-2">
//           <div className="relative aspect-[4/3] w-full overflow-hidden rounded-sm bg-ink-900">
//             {images.length > 0 ? (
//               <Image src={images[activeImg]} alt={property.title} fill sizes="(max-width: 1024px) 100vw, 66vw" className="object-cover" />
//             ) : (
//               <div className="flex h-full items-center justify-center font-mono text-xs text-paper-100/40">No image</div>
//             )}
//           </div>
//           {images.length > 1 && (
//             <div className="mt-3 flex gap-2 overflow-x-auto">
//               {images.map((img, i) => (
//                 <button
//                   key={img}
//                   onClick={() => setActiveImg(i)}
//                   className={`relative h-16 w-20 shrink-0 overflow-hidden rounded-sm border-2 ${
//                     activeImg === i ? "border-brass-500" : "border-transparent"
//                   }`}
//                 >
//                   <Image src={img} alt="" fill sizes="80px" className="object-cover" />
//                 </button>
//               ))}
//             </div>
//           )}

//           <div className="mt-8 flex items-start justify-between">
//             <div>
//               <h1 className="font-display text-3xl italic text-ink-950">{property.title}</h1>
//               <p className="mt-1 flex items-center gap-1 text-sm text-ink-800/60">
//                 <MapPin size={14} /> {property.area}, {property.city} — {property.pincode}
//               </p>
//             </div>
//             <button
//               onClick={toggleWishlist}
//               disabled={wishlistBusy}
//               className="rounded-full border border-ink-800/20 p-2.5 hover:border-rust-500"
//               aria-label="Toggle wishlist"
//             >
//               <Heart size={18} className={inWishlist ? "fill-rust-500 text-rust-500" : "text-ink-800/60"} />
//             </button>
//           </div>

//           <p className="mt-3 font-mono text-2xl tabular-nums text-brass-600">{formatPrice(property.price)}</p>

//           <div className="mt-4 flex flex-wrap items-center gap-5 border-y border-ink-800/10 py-4 font-mono text-sm text-ink-800/70">
//             {property.bhk && <span className="flex items-center gap-1.5"><BedDouble size={16} /> {property.bhk} BHK</span>}
//             {property.bathrooms && <span className="flex items-center gap-1.5"><Bath size={16} /> {property.bathrooms} Bath</span>}
//             {property.areaSize && <span className="flex items-center gap-1.5"><Ruler size={16} /> {property.areaSize} sqft</span>}
//             <span className="flex items-center gap-1.5"><Eye size={16} /> {property.views} views</span>
//             <span className="capitalize">{property.furnishing}</span>
//             <span className="rounded-sm bg-sage-500/10 px-2 py-0.5 capitalize text-sage-600">{property.status}</span>
//           </div>

//           <div className="mt-6">
//             <h2 className="font-display text-xl text-ink-950">Description</h2>
//             <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-ink-800/80">{property.description}</p>
//           </div>

//           {property.amenities?.length > 0 && (
//             <div className="mt-6">
//               <h2 className="font-display text-xl text-ink-950">Amenities</h2>
//               <div className="mt-2 flex flex-wrap gap-2">
//                 {property.amenities.map((a) => (
//                   <span key={a} className="rounded-sm border border-ink-800/10 px-3 py-1 text-xs text-ink-800/70">
//                     {a}
//                   </span>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>

//         <div className="lg:col-span-1">
//           <div className="rounded-sm border border-ink-800/10 p-5">
//             <p className="font-mono text-xs uppercase tracking-widest text-ink-800/50">Listed by</p>
//             <div className="mt-2 flex items-center gap-3">
//               <div className="h-11 w-11 overflow-hidden rounded-full bg-ink-900">
//                 {property.seller?.profilePic && (
//                   <Image src={property.seller.profilePic} alt="" width={44} height={44} className="h-full w-full object-cover" />
//                 )}
//               </div>
//               <div>
//                 <p className="font-display text-base text-ink-950">{property.seller?.name}</p>
//                 <p className="text-xs text-ink-800/50">{property.seller?.email}</p>
//               </div>
//             </div>

//             {isOwner ? (
//               <p className="mt-4 text-xs text-ink-800/50">This is your own listing.</p>
//             ) : (
//               <>
//                 <Link
//                   href={`/chat?sellerId=${property.seller?._id}&propertyId=${property._id}`}
//                   className="mt-4 flex w-full items-center justify-center gap-2 rounded-sm bg-ink-900 px-4 py-2.5 font-mono text-xs uppercase tracking-widest text-paper-50 hover:bg-ink-800"
//                 >
//                   <MessageCircle size={14} /> Message seller
//                 </Link>

//                 <form onSubmit={handleInquiry} className="mt-4 border-t border-ink-800/10 pt-4">
//                   <p className="font-mono text-xs uppercase tracking-widest text-ink-800/50">Send an inquiry</p>
//                   {inquirySent ? (
//                     <p className="mt-2 text-sm text-sage-600">Inquiry sent — the seller will get back to you.</p>
//                   ) : (
//                     <>
//                       <textarea
//                         required
//                         rows={3}
//                         placeholder="I'm interested in this property..."
//                         value={inquiryMsg}
//                         onChange={(e) => setInquiryMsg(e.target.value)}
//                         className="mt-2 w-full rounded-sm border border-ink-800/20 px-3 py-2 text-sm focus:border-brass-500 focus:outline-none"
//                       />
//                       {inquiryError && <p className="mt-1 text-xs text-rust-500">{inquiryError}</p>}
//                       <Button type="submit" disabled={inquiryLoading} className="mt-3 w-full">
//                         {inquiryLoading ? "Sending..." : "Send inquiry"}
//                       </Button>
//                     </>
//                   )}
//                 </form>
//               </>
//             )}
//           </div>
//         </div>
//       </div>

//       {similar.length > 0 && (
//         <div className="mt-16">
//           <h2 className="font-display text-2xl text-ink-950">Similar properties</h2>
//           <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
//             {similar.map((p) => (
//               <PropertyCard key={p._id} property={p} />
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }




"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import Spinner from "@/components/Spinner";
import PropertyForm from "@/components/PropertyForm";
import { useAuth } from "@/context/AuthContext";

export default function EditPropertyPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get(`/property/${id}`)
      .then(({ data }) => setProperty(data.property))
      .catch(() => setError("Failed to load this property."))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Spinner />;

  if (error || !property) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <p className="text-ink-800/60">{error || "Property not found."}</p>
      </div>
    );
  }

  const isOwner = user && property.seller?._id === user._id;
  const isAdmin = user?.role === "admin";

  if (!isOwner && !isAdmin) {
    router.replace("/unauthorized");
    return <Spinner />;
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl italic text-ink-950">Edit property</h1>
      <p className="mt-1 text-sm text-ink-800/60">Update the details below and save your changes.</p>
      <PropertyForm initialData={property} propertyId={property._id} />
    </div>
  );
}