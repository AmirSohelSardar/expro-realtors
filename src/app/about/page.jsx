import Image from "next/image";
import ExploreCTAButton from "@/components/ExploreCTAButton";
import {
  Home,
  ShieldCheck,
  Building2,
  Target,
  Eye,
  Award,
  Star,
  Ear,
  MapPin,
  Handshake,
  Scale,
  Zap,
  HeartHandshake,
  Users,
} from "lucide-react";

export const metadata = {
  title: "About Us | Expro Realtors",
  description:
    "Expro Realtors is a trusted property consultant in Kolkata helping buyers, sellers, and NRI investors across Newtown, Rajarhat, Madhyamgram, and North Kolkata.",
};

const trustReasons = [
  {
    icon: Ear,
    title: "We Listen First",
    description:
      "We understand your needs and budget before suggesting any property. No pressure. Ever.",
  },
  {
    icon: ShieldCheck,
    title: "Verified & Legal",
    description:
      "Every listing is WBRERA compliant, legally clear, and accurately priced. No surprises after purchase.",
  },
  {
    icon: MapPin,
    title: "We Know Every Project",
    description:
      "Our team has personally visited every project we recommend across Newtown, Rajarhat, and Madhyamgram.",
  },
  {
    icon: Handshake,
    title: "With You at Every Step",
    description:
      "From site visit to registration, we handle everything so buying feels easy and stress-free.",
  },
];

const values = [
  {
    icon: Scale,
    title: "Honest Dealings",
    description:
      "Every property deal should be built on trust, clarity and honesty — complete transparency, no hidden charges, no false promises.",
  },
  {
    icon: Zap,
    title: "Tech-Driven",
    description:
      "Smart technology makes property search faster and more reliable — real-time access to verified listings, anytime, anywhere.",
  },
  {
    icon: HeartHandshake,
    title: "People Over Profit",
    description:
      "Every recommendation is based on your needs, budget and goals — not our commission. Your satisfaction is the only metric that matters.",
  },
  {
    icon: Users,
    title: "Collaborative Mindset",
    description:
      "We treat every buyer, seller and developer as a long-term partner, not a one-time transaction — built on relationships, not deals.",
  },
];

const stats = [
  { number: "500+", label: "Successful Transactions" },
  { number: "1000+", label: "Properties Listed" },
  { number: "5.0★", label: "Google Rating" },
  { number: "99%", label: "Client Satisfaction" },
];

export default function AboutPage() {
  return (
    <div className="bg-paper-50">

      {/* HERO */}
      <section className="relative overflow-hidden border-b border-ink-800/10 bg-gradient-to-br from-paper-50 via-paper-100 to-brass-500/5">
        <div className="absolute -left-20 top-20 h-72 w-72 rounded-full bg-brass-400/10 blur-3xl"></div>
        <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-brass-500/10 blur-3xl"></div>

        <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-6 py-20 lg:grid-cols-2 lg:py-28">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-brass-600">
              About Expro Realtors
            </p>

            <h1 className="mt-5 font-display text-4xl italic leading-tight text-ink-950 sm:text-5xl">
              Finding the right property —
              <span className="not-italic text-brass-600"> anywhere in Kolkata.</span>
            </h1>

            <p className="mt-6 max-w-xl text-[15px] leading-7 text-ink-800/70">
              Expro Realtors is a trusted property consultant in Kolkata, helping buyers, sellers,
              and NRI investors across Newtown, Rajarhat, Madhyamgram, and North Kolkata. From
              WBRERA-verified new launches to ready-to-move flats, bungalows, plots, and commercial
              spaces, we offer honest, end-to-end guidance.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <div className="flex items-center gap-1.5 rounded-full border border-ink-800/20 px-4 py-2 font-mono text-xs uppercase tracking-widest text-ink-900">
                <ShieldCheck size={13} className="text-brass-500" /> WBRERA Verified
              </div>
              <div className="flex items-center gap-1.5 rounded-full border border-ink-800/20 px-4 py-2 font-mono text-xs uppercase tracking-widest text-ink-900">
                <Handshake size={13} className="text-brass-500" /> 500+ Transactions
              </div>
              <div className="flex items-center gap-1.5 rounded-full border border-ink-800/20 px-4 py-2 font-mono text-xs uppercase tracking-widest text-ink-900">
                <Star size={13} className="text-brass-500" /> 5.0 Google Rating
              </div>
            </div>
          </div>

          {/* CEO */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 animate-pulse rounded-full bg-brass-400 blur-3xl opacity-20"></div>
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

      {/* WHY FAMILIES TRUST US */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-brass-600">Why Us</p>
          <h2 className="mt-3 font-display text-3xl italic text-ink-950">
            Why 500+ families trust us
          </h2>
        </div>

        <div className="mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-2">
          {trustReasons.map((item) => (
            <div key={item.title} className="flex gap-4 border-t border-ink-800/10 pt-5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brass-500/10 text-brass-600">
                <item.icon size={17} />
              </span>
              <div>
                <h3 className="font-display text-lg text-ink-950">{item.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-800/70">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* MISSION */}
      <section className="border-t border-ink-800/10 bg-paper-100 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-16 lg:grid-cols-2 lg:items-start">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.25em] text-brass-600">Our Purpose</p>
              <h2 className="mt-3 font-display text-3xl italic text-ink-950">
                Our mission &amp; what we stand for
              </h2>
              <p className="mt-6 text-[15px] leading-7 text-ink-800/70">
                Our mission is simple — make property buying, selling and investing transparent
                and stress-free for every client in Kolkata. We believe every buyer deserves
                honest guidance, verified listings, and zero brokerage costs. That&rsquo;s why our
                clients trust us not just for a single deal, but for every property decision that
                follows.
              </p>
            </div>

            <div className="grid gap-5">
              <div className="rounded-sm border border-ink-800/10 bg-paper-50 p-6">
                <Target className="text-brass-500" size={26} />
                <h3 className="mt-4 font-display text-xl text-ink-950">Our Mission</h3>
                <p className="mt-2 text-sm text-ink-800/70">
                  To make property buying, selling and renting transparent, efficient and
                  accessible for every family in Kolkata.
                </p>
              </div>

              <div className="rounded-sm border border-ink-800/10 bg-paper-50 p-6">
                <Eye className="text-brass-500" size={26} />
                <h3 className="mt-4 font-display text-xl text-ink-950">Our Vision</h3>
                <p className="mt-2 text-sm text-ink-800/70">
                  To become Kolkata&rsquo;s most trusted name in real estate — known for
                  transparency, verified listings, and zero-brokerage guidance.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="border-y border-navy-800 bg-navy-900">
        <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-navy-800 px-6 lg:grid-cols-4">
          {stats.map((item) => (
            <div key={item.label} className="px-4 py-10 text-center">
              <div className="font-mono text-3xl tabular-nums text-brass-400">{item.number}</div>
              <p className="mt-2 font-mono text-[10px] uppercase tracking-widest text-paper-100/60">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* VALUES */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-brass-600">What Guides Us</p>
          <h2 className="mt-3 font-display text-3xl italic text-ink-950">Our values</h2>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((item) => (
            <div
              key={item.title}
              className="rounded-sm border border-ink-800/10 bg-paper-50 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-brass-500/30 hover:shadow-lg hover:shadow-ink-900/5"
            >
              <item.icon className="text-brass-500" size={24} />
              <h3 className="mt-4 font-display text-lg text-ink-950">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-800/70">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

     {/* TEAM */}
      <section className="border-t border-ink-800/10 bg-paper-100 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div className="relative mx-auto aspect-[4/3] w-full max-w-md overflow-hidden rounded-sm border border-ink-800/10 bg-ink-900 shadow-sm">
              <Image
                src="/team.jpg"
                alt="The Expro Realtors team"
                fill
                sizes="(max-width: 1024px) 100vw, 448px"
                className="object-cover"
              />
            </div>

            <div>
              <p className="font-mono text-xs uppercase tracking-[0.25em] text-brass-600">Our People</p>
              <h2 className="mt-3 font-display text-3xl italic text-ink-950">Meet the team</h2>

              <p className="mt-5 text-[15px] leading-7 text-ink-800/70">
                Hi, this is our complete Expro Realtors company, under our CEO,{" "}
                <span className="font-semibold text-ink-950">Habibur Rahaman</span>. We provide the
                best property dealing experience in Kolkata — from the first site visit to the
                final registration, we stay with every client until the deal is closed.
              </p>

              <p className="mt-4 text-[15px] leading-7 text-ink-800/70">
                Our team is like a family. Every member, from the people who verify a listing to
                the ones who answer your call at midnight before a big decision, works with one
                goal — making sure you never feel alone in a property deal. That&rsquo;s the
                promise we bring to every family we work with.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CEO MESSAGE */}
      <section className="bg-ink-950 py-20 text-paper-50">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <Award size={40} className="mx-auto text-brass-400" />

          <h2 className="mt-6 font-display text-3xl italic">A message from our leadership</h2>

          <p className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-paper-100/70">
            &ldquo;At Expro Realtors, we believe every family deserves a transparent, secure, and
            stress-free property buying experience. Technology should simplify real estate, not
            complicate it. Our team continues to build innovative solutions that connect people
            with their dream homes.&rdquo;
          </p>

          <div className="mt-8">
            <h3 className="font-display text-xl italic">Habibur Rahaman</h3>
            <p className="mt-1 font-mono text-xs uppercase tracking-widest text-brass-400">
              Chief Executive Officer
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="mx-auto max-w-4xl rounded-sm bg-brass-500 px-10 py-16 text-center">
          <Building2 size={44} className="mx-auto text-paper-50" />

          <h2 className="mt-6 font-display text-3xl italic text-paper-50">
            Ready to find your dream property?
          </h2>

          <p className="mt-4 text-[15px] text-paper-50/90">
            Browse verified listings, connect with trusted sellers, and discover properties that
            match your lifestyle.
          </p>

          <ExploreCTAButton />
        </div>
      </section>
    </div>
  );
}