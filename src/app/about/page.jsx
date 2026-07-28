import Image from "next/image";
import {
  Home,
  ShieldCheck,
  Users,
  MessageCircle,
  Building2,
  Target,
  Eye,
  Award,
} from "lucide-react";

export const metadata = {
  title: "About Us | Expro Realtors",
  description:
    "Learn more about Expro Realtors and our mission to simplify buying, selling, and renting properties.",
};

const values = [
  {
    icon: Home,
    title: "Direct Property Deals",
    description:
      "Connect directly with property owners and buyers without unnecessary intermediaries.",
  },
  {
    icon: ShieldCheck,
    title: "Verified Listings",
    description:
      "Every listing is reviewed before publication for better trust and transparency.",
  },
  {
    icon: MessageCircle,
    title: "Secure Messaging",
    description:
      "Discuss property details safely inside the platform before sharing contact information.",
  },
  {
    icon: Users,
    title: "Buyer & Seller Friendly",
    description:
      "Designed equally for buyers, sellers, landlords, tenants, and real estate professionals.",
  },
];

const stats = [
  { number: "1000+", label: "Properties Listed" },
  { number: "500+", label: "Happy Buyers" },
  { number: "300+", label: "Trusted Sellers" },
  { number: "99%", label: "Customer Satisfaction" },
];

export default function AboutPage() {
  return (
    <div className="bg-paper-50">

      {/* HERO */}
      <section className="relative overflow-hidden border-b border-ink-800/10 bg-gradient-to-br from-paper-50 via-paper-100 to-brass-500/5">
        <div className="absolute -left-20 top-20 h-72 w-72 rounded-full bg-brass-400/20 blur-3xl"></div>
        <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-brass-500/20 blur-3xl"></div>

        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-6 py-24 lg:grid-cols-2">
          <div>
            <p className="font-mono text-sm uppercase tracking-[0.25em] text-brass-600">
              About Expro Realtors
            </p>

            <h1 className="mt-5 text-5xl font-black leading-tight text-ink-950 lg:text-6xl">
              A smarter way to
              <span className="text-brass-600"> buy, sell & rent</span>
              properties.
            </h1>

            <p className="mt-7 text-lg leading-8 text-ink-800/70">
              Expro Realtors is a modern real estate platform focused on making
              property transactions simple, transparent, and trustworthy. Our
              mission is to connect buyers, sellers, landlords, and tenants
              through verified listings and seamless communication.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <div className="rounded-full border border-ink-800/20 px-6 py-3 font-semibold text-ink-900">
                Verified Listings
              </div>
              <div className="rounded-full border border-ink-800/20 px-6 py-3 font-semibold text-ink-900">
                Secure Messaging
              </div>
              <div className="rounded-full border border-ink-800/20 px-6 py-3 font-semibold text-ink-900">
                Trusted Platform
              </div>
            </div>
          </div>

        {/* CEO */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 animate-pulse rounded-full bg-brass-400 blur-3xl opacity-30"></div>
              <div className="relative h-56 w-56 overflow-hidden rounded-full border-4 border-brass-500 shadow-xl animate-float transition duration-500 hover:scale-105 sm:h-64 sm:w-64 lg:h-72 lg:w-72">
                <Image
                  src="/ceo.jpg"
                  alt="CEO"
                  fill
                  priority
                  sizes="(max-width: 640px) 224px, (max-width: 1024px) 256px, 288px"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* COMPANY STORY */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="grid gap-16 lg:grid-cols-2">
          <div>
            <h2 className="text-4xl font-bold text-ink-950">Our Story</h2>

            <p className="mt-6 leading-8 text-ink-800/70">
              Expro Realtors was created with one simple vision—to remove the
              confusion from property buying and selling. Traditional real
              estate transactions often involve multiple intermediaries,
              hidden information, and outdated listings. We wanted to build a
              platform where transparency comes first.
            </p>

            <p className="mt-6 leading-8 text-ink-800/70">
              Today our platform helps people discover verified properties,
              communicate directly with owners, and make informed decisions
              through an intuitive digital experience.
            </p>
          </div>

          <div className="grid gap-6">
            <div className="rounded-xl border border-ink-800/10 p-8">
              <Target className="text-brass-500" size={40} />
              <h3 className="mt-4 text-2xl font-bold text-ink-950">Our Mission</h3>
              <p className="mt-3 text-ink-800/70">
                To make property buying, selling and renting transparent,
                efficient and accessible for everyone.
              </p>
            </div>

            <div className="rounded-xl border border-ink-800/10 p-8">
              <Eye className="text-brass-500" size={40} />
              <h3 className="mt-4 text-2xl font-bold text-ink-950">Our Vision</h3>
              <p className="mt-3 text-ink-800/70">
                To become India's most trusted digital real estate marketplace.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="bg-paper-100 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-ink-950">Why Choose Expro Realtors</h2>
            <p className="mt-4 text-ink-800/70">
              Everything you need to buy, sell or rent confidently.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-2 xl:grid-cols-4">
            {values.map((item) => (
              <div
                key={item.title}
                className="rounded-xl bg-paper-50 p-8 shadow-sm transition hover:-translate-y-2 hover:shadow-xl"
              >
                <item.icon className="text-brass-500" size={34} />
                <h3 className="mt-5 text-xl font-bold text-ink-950">{item.title}</h3>
                <p className="mt-3 text-ink-800/70">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-24">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-6 lg:grid-cols-4">
          {stats.map((item) => (
            <div key={item.label} className="rounded-xl border border-ink-800/10 p-10 text-center">
              <div className="text-5xl font-black text-brass-600">{item.number}</div>
              <p className="mt-3 text-ink-800/70">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CEO MESSAGE */}
      <section className="bg-ink-950 py-24 text-paper-50">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <Award size={50} className="mx-auto text-brass-400" />

          <h2 className="mt-6 text-4xl font-bold">A Message from Our Leadership</h2>

          <p className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-paper-100/70">
            "At Expro Realtors, we believe every family deserves a transparent,
            secure, and stress-free property buying experience. Technology
            should simplify real estate, not complicate it. Our team continues
            to build innovative solutions that connect people with their dream
            homes."
          </p>

          <div className="mt-8">
            <h3 className="text-2xl font-bold">HABIBUR RAHAMAN</h3>
            <p className="text-brass-400">Chief Executive Officer</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="mx-auto max-w-4xl rounded-3xl bg-brass-500 px-10 py-20 text-center">
          <Building2 size={55} className="mx-auto text-paper-50" />

          <h2 className="mt-6 text-4xl font-bold text-paper-50">
            Ready to Find Your Dream Property?
          </h2>

          <p className="mt-5 text-lg text-paper-50/90">
            Browse verified listings, connect with trusted sellers,
            and discover properties that match your lifestyle.
          </p>

          <button className="mt-10 rounded-full bg-paper-50 px-8 py-4 font-bold text-brass-600 transition hover:scale-105">
            Explore Properties
          </button>
        </div>
      </section>
    </div>
  );
}