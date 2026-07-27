export function formatPrice(value) {
  if (value === undefined || value === null) return "";
  const n = Number(value);
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)} Cr`;
  if (n >= 100000) return `₹${(n / 100000).toFixed(2)} L`;
  return `₹${n.toLocaleString("en-IN")}`;
}

export function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

export function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function propertyUrl(property) {
  const slug = slugify(property.title || "property");
  return `/properties/${slug}-${property._id}`;
}

export function formatChatTime(date) {
  return new Date(date).toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export function formatChatDateLabel(date) {
  const d = new Date(date);
  const now = new Date();
  const startOfDay = (dt) => new Date(dt.getFullYear(), dt.getMonth(), dt.getDate());
  const diffDays = Math.round((startOfDay(now) - startOfDay(d)) / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
}

export function roleLabel(otherUser, chat) {
  if (!otherUser) return "";
  const isSellerSlot = chat.seller?._id === otherUser._id;
  if (otherUser.role === "admin") {
    return isSellerSlot ? "(Admin as Seller)" : "(Admin as Buyer)";
  }
  return isSellerSlot ? "(Seller)" : "(Buyer)";
}

export function cldOptimize(url, width) {
  if (!url || !url.includes("res.cloudinary.com")) return url;
  const transform = width ? `f_auto,q_auto,w_${width}` : "f_auto,q_auto";
  return url.replace("/upload/", `/upload/${transform}/`);
}